import { NextResponse } from "next/server";
import { getSessionWithUser, verifyPassword, hashPassword } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = (/session_token=([^;]+)/.exec(cookie) || [])[1] || null;
  const sess = await getSessionWithUser(token);
  if (!sess) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  try {
    const rows = await query(`SELECT password_hash, password_salt FROM users WHERE id = ?`, [sess.user.id]);
    if (rows.length === 0) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const ok = await verifyPassword(currentPassword, rows[0].password_salt, rows[0].password_hash);
    if (!ok) return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });
    const { salt, hash } = await hashPassword(newPassword);
    await query(`UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?`, [hash, salt, sess.user.id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

