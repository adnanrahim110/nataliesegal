import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    await query("SELECT 1 AS ok");
    return NextResponse.json({ ok: true, db: true });
  } catch (err) {
    console.error("GET /api/healthz error", err);
    return NextResponse.json({ ok: false, db: false }, { status: 503 });
  }
}

