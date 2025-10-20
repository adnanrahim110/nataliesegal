import { NextResponse } from "next/server";
import { getPool, query } from "@/lib/db";
import { getSessionWithUser } from "@/lib/auth";

export async function GET() {
  try {
    await getPool();
    const rows = await query(
      `SELECT b.id,
              b.slug,
              b.title,
              b.excerpt,
              b.author,
              DATE_FORMAT(b.published_at, '%b %e, %Y') AS date,
              b.read_time,
              b.views,
              COALESCE(c.comment_count, 0) AS comments,
              b.cover,
              b.category
         FROM blogs b
         LEFT JOIN (
           SELECT blog_id, COUNT(*) AS comment_count
             FROM blog_comments
            GROUP BY blog_id
         ) c ON c.blog_id = b.id
        WHERE b.published = 1
        ORDER BY b.published_at DESC`
    );
    // Normalize fields to what UI expects
    const posts = rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt || "",
      author: r.author || "",
      date: r.date || "",
      readTime: r.read_time || null,
      views: Number(r.views || 0),
      comments: Number(r.comments || 0),
      cover: r.cover || "/imgs/stories.avif",
      category: r.category || null,
    }));
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("GET /api/blogs error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await getPool();
    // Auth check
    const cookie = req.headers.get("cookie") || "";
    const token = (/session_token=([^;]+)/.exec(cookie) || [])[1] || null;
    const sess = await getSessionWithUser(token);
    if (!sess || (sess.user?.role !== "admin" && sess.user?.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, excerpt, content, cover, category, author, readTime, published } = body || {};
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "title, slug, content required" }, { status: 400 });
    }
    const safeAuthor = author || sess.user?.name || "Admin";
    const isPublished = typeof published === "boolean" ? (published ? 1 : 0) : 1;
    const now = new Date();
    await query(
      `INSERT INTO blogs (slug, title, excerpt, content, cover, category, author, read_time, views, comments, published, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)` ,
      [
        slug,
        title,
        excerpt || "",
        content,
        cover || "",
        category || null,
        safeAuthor,
        readTime || null,
        isPublished,
        now,
      ]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/blogs error", err);
    if (String(err?.message || "").includes("Duplicate entry") || String(err).includes("ER_DUP_ENTRY")) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
