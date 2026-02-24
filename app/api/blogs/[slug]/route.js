import { NextResponse } from "next/server";
import { getPublishedPostBySlug } from "@/lib/blogs";

export async function GET(_req, { params }) {
  try {
    const { slug } = params || {};
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    const post = await getPublishedPostBySlug(slug);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const res = NextResponse.json({
      post: {
        ...post,
        content: (post.content || "").split(/\n\n+/).filter(Boolean),
      },
    });
    res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res;
  } catch (err) {
    console.error("GET /api/blogs/[slug] error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
