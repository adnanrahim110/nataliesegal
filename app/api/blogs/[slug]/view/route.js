import { NextResponse } from "next/server";
import { getPool, query } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

export async function POST(_req, { params }) {
  try {
    await getPool();
    const slug = params?.slug;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const ip = getClientIp(_req);
    const rl = rateLimit(`view:${ip}:${slug}`, { limit: 30, windowMs: 60 * 60 * 1000 });
    if (!rl.allowed) {
      return NextResponse.json({ ok: true });
    }

    // Prefer a single DB round-trip (MariaDB supports UPDATE ... RETURNING).
    try {
      const rows = await query(
        `UPDATE blogs
            SET views = views + 1
          WHERE slug = ? AND published = 1
        RETURNING views`,
        [slug]
      );
      if (!rows || rows.length === 0) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json({ ok: true, views: Number(rows?.[0]?.views || 0) });
    } catch (err) {
      // Fallback for MySQL (no RETURNING) or older engines.
      const result = await query(
        `UPDATE blogs
            SET views = views + 1
          WHERE slug = ? AND published = 1`,
        [slug]
      );
      if (!result?.affectedRows) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      const rows = await query(`SELECT views FROM blogs WHERE slug = ? LIMIT 1`, [slug]);
      return NextResponse.json({ ok: true, views: Number(rows?.[0]?.views || 0) });
    }
  } catch (err) {
    console.error("POST /api/blogs/[slug]/view error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
