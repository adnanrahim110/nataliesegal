"use server";

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getSessionWithUser } from "@/lib/auth";
import { query } from "@/lib/db";

async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS email_change_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      new_email VARCHAR(190) NOT NULL,
      code_hash CHAR(64) NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_email_change_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY uniq_email_change_user (user_id)
    ) ENGINE=InnoDB;
  `);
}

export async function POST(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = (/session_token=([^;]+)/.exec(cookieHeader) || [])[1] || null;
  const session = await getSessionWithUser(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const code = String(body?.code || "").trim();
  if (!code) {
    return NextResponse.json({ error: "Verification code is required." }, { status: 400 });
  }

  await ensureTable();

  const rows = await query(
    "SELECT * FROM email_change_requests WHERE user_id = ? LIMIT 1",
    [session.user.id]
  );
  if (rows.length === 0) {
    return NextResponse.json(
      { error: "No pending email change request found." },
      { status: 400 }
    );
  }

  const requestRow = rows[0];
  if (new Date(requestRow.expires_at).getTime() < Date.now()) {
    await query("DELETE FROM email_change_requests WHERE user_id = ?", [
      session.user.id,
    ]);
    return NextResponse.json(
      { error: "The verification code has expired. Request a new one." },
      { status: 400 }
    );
  }

  const submittedHash = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");

  if (submittedHash !== requestRow.code_hash) {
    return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
  }

  const conflict = await query(
    "SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1",
    [requestRow.new_email, session.user.id]
  );
  if (conflict.length > 0) {
    await query("DELETE FROM email_change_requests WHERE user_id = ?", [
      session.user.id,
    ]);
    return NextResponse.json(
      { error: "That email became unavailable. Choose a different one." },
      { status: 409 }
    );
  }

  await query("UPDATE users SET email = ? WHERE id = ?", [
    requestRow.new_email,
    session.user.id,
  ]);
  await query("DELETE FROM email_change_requests WHERE user_id = ?", [
    session.user.id,
  ]);

  return NextResponse.json({
    message: "Email address updated.",
    newEmail: requestRow.new_email,
  });
}
