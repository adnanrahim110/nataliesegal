import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const RESET_TOKEN_BYTES = 32;
const RESET_EXPIRY_MINUTES = 60;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getAppUrl(req) {
  const origin = req.headers.get("origin");
  if (origin && origin.startsWith("http")) return origin.replace(/\/$/, "");
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  return "http://localhost:3000";
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

  try {
    const users = await query(`SELECT id FROM users WHERE email = ? LIMIT 1`, [email]);
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
    const responsePayload = { ok: true };
    if (process.env.NODE_ENV !== "production") {
      responsePayload.resetUrl = resetUrl;
    }

    return NextResponse.json(responsePayload);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
