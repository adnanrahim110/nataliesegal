import { NextResponse } from "next/server";
import { getSessionWithUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = (/session_token=([^;]+)/.exec(cookie) || [])[1] || null;
  const sess = await getSessionWithUser(token);
  if (!sess) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const rows = await query(`SELECT id, email, name, role, avatar_url, created_at FROM users WHERE id = ?`, [sess.user.id]);
    if (rows.length === 0) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ user: rows[0] });
  } catch (e) {
    return NextResponse.json({ user: sess.user });
  }
}

export async function PATCH(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = (/session_token=([^;]+)/.exec(cookie) || [])[1] || null;
  const sess = await getSessionWithUser(token);
  if (!sess) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const name = body?.name || null;
  const email = body?.email || null;
  if (!name || !email) return NextResponse.json({ error: "name and email required" }, { status: 400 });
  try {
    await maybeAddAvatarColumn();
    await query(`UPDATE users SET name = ?, email = ? WHERE id = ?`, [name, email, sess.user.id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (String(err).includes("ER_DUP_ENTRY")) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function maybeAddAvatarColumn() {
  try {
    const rows = await query(`SHOW COLUMNS FROM users LIKE 'avatar_url'`);
    if (rows.length === 0) {
      await query(`ALTER TABLE users ADD COLUMN avatar_url VARCHAR(512) NULL AFTER role`);
    }
  } catch {}
}

