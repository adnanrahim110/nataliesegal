import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendForgotPasswordEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/url";

const RESET_TOKEN_BYTES = 32;
const RESET_EXPIRY_MINUTES = 60;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getAppUrl(req) {
  const origin = req.headers.get("origin");
  if (origin && origin.startsWith("http")) return origin.replace(/\/$/, "");
  return getSiteUrl();
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

export async function POST(req) {
  let email = "";
  try {
    const body = await req.json();
    email = (body?.email || "").toString().trim().toLowerCase();
  } catch (err) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  await ensurePasswordResetSchema();

  try {
    const users = await query(
      `SELECT id, name FROM users WHERE email = ? LIMIT 1`,
      [email]
    );
    if (users.length === 0) {
      return NextResponse.json({ ok: true });
    }

    const userId = users[0].id;
    await query(`DELETE FROM password_resets WHERE expires_at < NOW() OR used_at IS NOT NULL`);
    await query(`DELETE FROM password_resets WHERE user_id = ?`, [userId]);

    const token = crypto.randomBytes(RESET_TOKEN_BYTES).toString("hex");
    const tokenHash = hashToken(token);
    await query(
      `INSERT INTO password_resets (user_id, token_hash, expires_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))`,
      [userId, tokenHash, RESET_EXPIRY_MINUTES]
    );

    const appUrl = getAppUrl(req);
    const resetUrl = `${appUrl}/admin/login/reset?token=${token}`;
    await sendForgotPasswordEmail({
      to: email,
      name: users[0]?.name || "",
      resetUrl,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Forgot Password] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
