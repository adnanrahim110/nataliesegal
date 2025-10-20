import { NextResponse } from "next/server";
import { invalidateSession } from "@/lib/auth";

export async function POST(req) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const token = (/session_token=([^;]+)/.exec(cookie) || [])[1] || null;
    if (token) await invalidateSession(token);
    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: "session_token",
      value: "",
      path: "/",
      maxAge: 0,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ ok: true });
  }
}

