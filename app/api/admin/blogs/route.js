import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSessionWithUser } from "@/lib/auth";

export async function GET(req) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const token = (/session_token=([^;]+)/.exec(cookie) || [])[1] || null;
    const sess = await getSessionWithUser(token);
    if (!sess || (sess.user?.role !== "admin" && sess.user?.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rows = await query(
      `SELECT id, slug, title, published,
              DATE_FORMAT(published_at, '%b %e, %Y') as date,
              category
         FROM blogs
        ORDER BY published_at DESC, id DESC`
    );
    return NextResponse.json({ posts: rows });
  } catch (err) {
    console.error("GET /api/admin/blogs error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

