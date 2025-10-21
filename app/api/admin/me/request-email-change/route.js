"use server";

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getSessionWithUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { sendEmailChangeVerification } from "@/lib/email";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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

  const rawEmail = String(body?.newEmail || "").trim();
  if (!rawEmail || !EMAIL_REGEX.test(rawEmail)) {
    return NextResponse.json({ error: "Provide a valid email address." }, { status: 400 });
  }

  const newEmail = rawEmail.toLowerCase();
  const currentEmail = (session.user.email || "").toLowerCase();
  if (newEmail === currentEmail) {
    return NextResponse.json(
      { error: "The new email cannot match your current email." },
      { status: 400 }
    );
  }

  await ensureTable();

  const duplicate = await query(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [newEmail]
  );
  if (duplicate.length > 0) {
    return NextResponse.json(
      { error: "That email address is already in use." },
      { status: 409 }
    );
  }

  const code = crypto.randomInt(100000, 1000000).toString();
  const codeHash = crypto.createHash("sha256").update(code).digest("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await query("DELETE FROM email_change_requests WHERE user_id = ?", [
    session.user.id,
  ]);

  try {
    await query(
      `INSERT INTO email_change_requests (user_id, new_email, code_hash, expires_at)
       VALUES (?, ?, ?, ?)`,
      [session.user.id, newEmail, codeHash, expiresAt]
    );

    await sendEmailChangeVerification({
      to: session.user.email,
      name: session.user.name || "",
      code,
      newEmail,
      expiresMinutes: 10,
    });
  } catch (err) {
    await query("DELETE FROM email_change_requests WHERE user_id = ?", [
      session.user.id,
    ]);
    console.error("[Email Change] Failed to send verification:", err);
    return NextResponse.json(
      { error: "Failed to send verification email. Try again shortly." },
      { status: 500 }
    );
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(
      `[Email Change] Verification code for ${session.user.email}: ${code}`
    );
  }

  return NextResponse.json({
    message: "Verification code sent to your current email.",
    expiresAt: expiresAt.toISOString(),
    devCode: process.env.NODE_ENV !== "production" ? code : undefined,
  });
}
