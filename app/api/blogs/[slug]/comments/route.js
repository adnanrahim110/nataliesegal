import { getPool, query } from "@/lib/db";
import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

function toIso(value) {
  if (!value) return new Date().toISOString();
  try {
    return new Date(value).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export async function GET(_req, { params }) {
  try {
    await getPool();
    const slug = params?.slug;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const rows = await query(
      `SELECT c.id, c.name, c.message, c.created_at
         FROM blog_comments c
         INNER JOIN blogs b ON b.id = c.blog_id
        WHERE b.slug = ?
        ORDER BY c.created_at DESC
        LIMIT 200`,
      [slug]
    );

    const comments = rows.map((row) => ({
      id: row.id,
      name: row.name || "Anonymous",
      message: row.message || "",
      createdAt: toIso(row.created_at),
    }));

    return NextResponse.json({ comments });
  } catch (err) {
    console.error("GET /api/blogs/[slug]/comments error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    await getPool();
    const slug = params?.slug;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const ip = getClientIp(req);
    const rl = rateLimit(`comment:${ip}:${slug}`, { limit: 10, windowMs: 60 * 1000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many comments. Please slow down." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) },
        }
      );
    }

    const blogRows = await query(`SELECT id FROM blogs WHERE slug = ? LIMIT 1`, [slug]);
    if (blogRows.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    const blogId = blogRows[0].id;

    let body;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const rawName = (body?.name || "").toString().trim();
    const rawMessage = (body?.message || "").toString().trim();

    if (rawMessage.length < 2) {
      return NextResponse.json({ error: "Comment is too short" }, { status: 400 });
    }
    if (rawMessage.length > 1000) {
      return NextResponse.json({ error: "Comment is too long" }, { status: 400 });
    }

    const name = (rawName || "Anonymous").slice(0, 190);
    const message = rawMessage.slice(0, 1000);

    const result = await query(
      `INSERT INTO blog_comments (blog_id, name, message)
       VALUES (?, ?, ?)`,
      [blogId, name, message]
    );

    let nextCount = null;
    try {
      const rows = await query(
        `UPDATE blogs
            SET comments = comments + 1
          WHERE id = ?
        RETURNING comments`,
        [blogId]
      );
      nextCount = Number(rows?.[0]?.comments);
    } catch {
      await query(`UPDATE blogs SET comments = comments + 1 WHERE id = ?`, [blogId]);
    }

    const insertedId = result?.insertId;
    const [insertedRow] =
      insertedId != null
        ? await query(`SELECT id, name, message, created_at FROM blog_comments WHERE id = ?`, [insertedId])
        : [];

    const comment = insertedRow
      ? {
        id: insertedRow.id,
        name: insertedRow.name || name,
        message: insertedRow.message || message,
        createdAt: toIso(insertedRow.created_at),
      }
      : {
        id: insertedId || Date.now(),
        name,
        message,
        createdAt: new Date().toISOString(),
      };

    if (Number.isNaN(nextCount) || nextCount == null) {
      const rows = await query(`SELECT comments FROM blogs WHERE id = ? LIMIT 1`, [blogId]);
      nextCount = Number(rows?.[0]?.comments);
    }

    return NextResponse.json({ ok: true, comment, count: Number(nextCount || 0) });
  } catch (err) {
    console.error("POST /api/blogs/[slug]/comments error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
