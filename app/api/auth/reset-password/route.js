"use server";

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

const RESET_EXPIRY_MINUTES = 60;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function ensurePasswordResetSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      token_hash CHAR(64) NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      used_at DATETIME NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `);

  const columns = await query(
    "SHOW COLUMNS FROM password_resets LIKE 'used_at'"
  );
  if (columns.length === 0) {
    await query(
      "ALTER TABLE password_resets ADD COLUMN used_at DATETIME NULL AFTER expires_at"
    );
  }
}

async function findResetRequest(token) {
  await ensurePasswordResetSchema();
  if (!token) return null;
  const hash = hashToken(token);
  const rows = await query(
    `SELECT id, user_id, expires_at, used_at FROM password_resets WHERE token_hash = ? LIMIT 1`,
    [hash]
  );
  return rows[0] || null;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = (searchParams.get("token") || "").trim();
  if (!token) {
    return NextResponse.json(
      { valid: false, error: "Missing reset token." },
      { status: 400 }
    );
  }

  try {
    const request = await findResetRequest(token);
    if (!request) {
      return NextResponse.json(
        { valid: false, error: "Reset link is invalid or has already been used." },
        { status: 404 }
      );
    }
    if (request.used_at) {
      return NextResponse.json(
        { valid: false, error: "This reset link has already been used." },
        { status: 409 }
      );
    }
    if (new Date(request.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { valid: false, error: "Reset link has expired. Request a new one." },
        { status: 410 }
      );
    }

    return NextResponse.json({ valid: true, expiresAt: request.expires_at });
  } catch (err) {
    console.error("[Reset Password][GET]", err);
    return NextResponse.json(
      { valid: false, error: "Unable to verify reset link." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const token = (body?.token || "").trim();
  const password = (body?.password || "").trim();

  if (!token) {
    return NextResponse.json({ error: "Missing reset token." }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters long." },
      { status: 400 }
    );
  }

  try {
    const request = await findResetRequest(token);
    if (!request) {
      return NextResponse.json(
        { error: "Reset link is invalid or has already been used." },
        { status: 404 }
      );
    }
    if (request.used_at) {
      return NextResponse.json(
        { error: "This reset link has already been used." },
        { status: 409 }
      );
    }
    if (new Date(request.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Reset link has expired. Request a new one." },
        { status: 410 }
      );
    }

    const { hash, salt } = await hashPassword(password);
    await query(
      `UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?`,
      [hash, salt, request.user_id]
    );
    await query(
      `UPDATE password_resets SET used_at = NOW() WHERE id = ?`,
      [request.id]
    );
    await query(
      `DELETE FROM password_resets WHERE user_id = ? AND id <> ?`,
      [request.user_id, request.id]
    );

    return NextResponse.json({ ok: true, expiresInMinutes: RESET_EXPIRY_MINUTES });
  } catch (err) {
    console.error("[Reset Password][POST]", err);
    return NextResponse.json(
      { error: "Unable to reset password. Try again later." },
      { status: 500 }
    );
  }
}
