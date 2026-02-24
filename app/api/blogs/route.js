import { NextResponse } from "next/server";
import { getPool, query } from "@/lib/db";
import { getSessionWithUser } from "@/lib/auth";
import { getPublishedPosts } from "@/lib/blogs";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    const posts = await getPublishedPosts();
    const res = NextResponse.json({ posts });
    res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res;
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
    revalidateTag("blogs");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/blogs error", err);
    if (String(err?.message || "").includes("Duplicate entry") || String(err).includes("ER_DUP_ENTRY")) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
