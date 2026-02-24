import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  const bootstrapToken = process.env.BOOTSTRAP_TOKEN;
  if (!bootstrapToken) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ip = getClientIp(req);
  const rl = rateLimit(`bootstrap:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) },
      }
    );
  }

  const provided = req.headers.get("x-bootstrap-token") || "";
  if (provided !== bootstrapToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const email = String(body?.email || "")
    .trim()
    .toLowerCase();
  const password = String(body?.password || "").trim();
  const name = String(body?.name || "Admin").trim().slice(0, 190) || "Admin";

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Provide a valid email address." }, { status: 400 });
  }
  if (!password || password.length < 12) {
    return NextResponse.json(
      { error: "Password must be at least 12 characters long." },
      { status: 400 }
    );
  }

  try {
    const existing = await query(`SELECT id FROM users LIMIT 1`);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Bootstrap is disabled because users already exist." },
        { status: 409 }
      );
    }

    const { salt, hash } = await hashPassword(password);
    await query(
      `INSERT INTO users (email, name, role, password_hash, password_salt)
       VALUES (?, ?, 'admin', ?, ?)`,
      [email, name, hash, salt]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/admin/bootstrap error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

