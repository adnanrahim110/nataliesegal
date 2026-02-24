import { createSession, verifyPassword } from "@/lib/auth";
import { getPool, query } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await getPool();
    const body = await req.json();
    const { email, password, remember } = body || {};
    if (!email || !password)
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });

    const ip = getClientIp(req);
    const rl = rateLimit(`login:${ip}`, { limit: 20, windowMs: 5 * 60 * 1000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) },
        }
      );
    }

    const rows = await query(
      `SELECT id, email, name, role, password_hash, password_salt
         FROM users WHERE email = ? LIMIT 1`,
      [email]
    );
    if (rows.length === 0)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const user = rows[0];
    const ok = await verifyPassword(password, user.password_salt, user.password_hash);
    if (!ok)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ua = req.headers.get("user-agent") || null;
    const maxAgeDays = remember ? 7 : 1;
    const token = await createSession(user.id, ua, ip, maxAgeDays);

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      name: "session_token",
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: isProd,
    };
    if (remember) {
      cookieOptions.maxAge = 7 * 24 * 60 * 60;
    }
    res.cookies.set(cookieOptions);
    return res;
  } catch (err) {
    console.error("Login error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
