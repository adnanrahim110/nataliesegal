import { NextResponse } from "next/server";
import { getSessionWithUser } from "@/lib/auth";
import fs from "node:fs/promises";
import path from "node:path";

export async function POST(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = (/session_token=([^;]+)/.exec(cookie) || [])[1] || null;
  const sess = await getSessionWithUser(token);
  if (!sess) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }
    if (!file.type?.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const ext = (file.name || "").split(".").pop() || "png";
    const dir = path.join(process.cwd(), "public", "uploads", "covers");
    await fs.mkdir(dir, { recursive: true });
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const out = path.join(dir, filename);
    await fs.writeFile(out, buffer);
    const url = `/uploads/covers/${filename}`;
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("upload cover error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

