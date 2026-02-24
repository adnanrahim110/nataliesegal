import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSessionWithUser } from "@/lib/auth";
import { revalidateTag } from "next/cache";

async function requireEditor(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = (/session_token=([^;]+)/.exec(cookie) || [])[1] || null;
  const sess = await getSessionWithUser(token);
  if (!sess || (sess.user?.role !== "admin" && sess.user?.role !== "editor")) {
    return null;
  }
  return sess;
}

export async function GET(req, { params }) {
  try {
    const sess = await requireEditor(req);
    if (!sess) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { slug } = params || {};
    const rows = await query(
      `SELECT id, slug, title, excerpt, content, cover, category, author,
              read_time, views, comments, published,
              DATE_FORMAT(published_at, '%Y-%m-%d %H:%i:%s') as published_at
         FROM blogs WHERE slug = ? LIMIT 1`,
      [slug]
    );
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ post: rows[0] });
  } catch (err) {
    console.error("GET /api/admin/blogs/[slug] error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const sess = await requireEditor(req);
    if (!sess) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { slug } = params || {};
    const body = await req.json();
    const fields = {
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      cover: body.cover,
      category: body.category,
      author: body.author,
      read_time: body.readTime ?? body.read_time,
      published: typeof body.published === "boolean" ? (body.published ? 1 : 0) : undefined,
    };

    const cols = [];
    const vals = [];
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) {
        cols.push(`${k} = ?`);
        vals.push(v);
      }
    }
    if (cols.length === 0) return NextResponse.json({ error: "No changes" }, { status: 400 });

    vals.push(slug);
    await query(`UPDATE blogs SET ${cols.join(", ")} WHERE slug = ?`, vals);
    const newSlug = fields.slug || slug;
    revalidateTag("blogs");
    return NextResponse.json({ ok: true, slug: newSlug });
  } catch (err) {
    console.error("PATCH /api/admin/blogs/[slug] error", err);
    if (String(err?.message || "").includes("Duplicate entry") || String(err).includes("ER_DUP_ENTRY")) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const sess = await requireEditor(req);
    if (!sess) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { slug } = params || {};
    await query(`DELETE FROM blogs WHERE slug = ?`, [slug]);
    revalidateTag("blogs");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/blogs/[slug] error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
