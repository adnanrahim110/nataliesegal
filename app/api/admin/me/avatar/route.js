import { NextResponse } from "next/server";
import { getSessionWithUser } from "@/lib/auth";
import { query } from "@/lib/db";
import fs from "node:fs/promises";
import path from "node:path";

export async function POST(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = (/session_token=([^;]+)/.exec(cookie) || [])[1] || null;
  const sess = await getSessionWithUser(token);
  if (!sess) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    // Fetch current avatar URL to remove after successful upload
    let oldUrl = null;
    try {
      const current = await query(`SELECT avatar_url FROM users WHERE id = ?`, [sess.user.id]);
      oldUrl = current?.[0]?.avatar_url || null;
    } catch {}

    const form = await req.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") return NextResponse.json({ error: "No file" }, { status: 400 });
    if (!file.type?.startsWith("image/")) return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length > 5 * 1024 * 1024) return NextResponse.json({ error: "File too large" }, { status: 400 });
    const ext = file.name.split(".").pop() || "png";
    const dir = path.join(process.cwd(), "public", "uploads", "avatars");
    await fs.mkdir(dir, { recursive: true });
    const filename = `${sess.user.id}-${Date.now()}.${ext}`;
    const out = path.join(dir, filename);
    await fs.writeFile(out, buffer);
    const url = `/uploads/avatars/${filename}`;
    // Try to remove old avatar file if it belongs to our avatars directory
    try {
      if (oldUrl && /^\/?uploads\/avatars\//.test(oldUrl)) {
        const avatarsDir = path.join(process.cwd(), "public", "uploads", "avatars");
        const rel = oldUrl.replace(/^\/+/, "");
        const oldPath = path.join(process.cwd(), "public", rel);
        const normalized = path.normalize(oldPath);
        if (normalized.startsWith(avatarsDir)) {
          await fs.unlink(normalized).catch(() => {});
        }
      }
    } catch {}

    await query(`UPDATE users SET avatar_url = ? WHERE id = ?`, [url, sess.user.id]);
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("upload avatar error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
