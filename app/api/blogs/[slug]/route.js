import { NextResponse } from "next/server";
import { getPool, query } from "@/lib/db";

export async function GET(_req, { params }) {
  try {
    await getPool();
    const { slug } = params || {};
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    const rows = await query(
      `SELECT b.id,
              b.slug,
              b.title,
              b.excerpt,
              b.author,
              DATE_FORMAT(b.published_at, '%b %e, %Y') AS date,
              b.read_time,
              b.views,
              COALESCE(c.comment_count, 0) AS comment_count,
              b.cover,
              b.category,
              b.content
         FROM blogs b
         LEFT JOIN (
           SELECT blog_id, COUNT(*) AS comment_count
             FROM blog_comments
            GROUP BY blog_id
         ) c ON c.blog_id = b.id
        WHERE b.slug = ? AND b.published = 1
        LIMIT 1`,
      [slug]
    );
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const r = rows[0];
    const post = {
      id: r.id,
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt || "",
      author: r.author || "",
      date: r.date || "",
      readTime: r.read_time || null,
      views: Number(r.views || 0),
      comments: Number(r.comment_count || 0),
      cover: r.cover || "/imgs/stories.avif",
      category: r.category || null,
      content: (r.content || "").split(/\n\n+/).filter(Boolean),
    };
    return NextResponse.json({ post });
  } catch (err) {
    console.error("GET /api/blogs/[slug] error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
