import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function GET(req) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not available" }, { status: 403 });
    }
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const password = url.searchParams.get("password");
    const name = url.searchParams.get("name") || "Admin";
    if (!email || !password) {
      return NextResponse.json({ error: "email and password required" }, { status: 400 });
    }
    const existing = await query(`SELECT id FROM users LIMIT 1`);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Users already exist" }, { status: 409 });
    }
    const { salt, hash } = await hashPassword(password);
    await query(
      `INSERT INTO users (email, name, role, password_hash, password_salt) VALUES (?, ?, 'admin', ?, ?)`,
      [email, name, hash, salt]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("create-admin error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

