import { NextResponse } from "next/server";
import { getPool, query } from "@/lib/db";

export async function POST(_req, { params }) {
  try {
    await getPool();
    const slug = params?.slug;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const rows = await query(`SELECT id, views FROM blogs WHERE slug = ? LIMIT 1`, [slug]);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const blogId = rows[0].id;
    await query(`UPDATE blogs SET views = views + 1 WHERE id = ?`, [blogId]);
    const [{ views }] = await query(`SELECT views FROM blogs WHERE id = ?`, [blogId]);

    return NextResponse.json({ ok: true, views: Number(views || 0) });
  } catch (err) {
    console.error("POST /api/blogs/[slug]/view error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
