import "server-only";

import { unstable_cache } from "next/cache";
import { query } from "@/lib/db";

function formatPostRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    author: row.author || "",
    date: row.date || "",
    readTime: row.read_time || null,
    views: Number(row.views || 0),
    comments: Number(row.comments || 0),
    cover: row.cover || "/imgs/stories.avif",
    category: row.category || null,
  };
}

export const getPublishedPosts = unstable_cache(
  async () => {
    const rows = await query(
      `SELECT id,
              slug,
              title,
              excerpt,
              author,
              DATE_FORMAT(published_at, '%b %e, %Y') AS date,
              read_time,
              views,
              comments,
              cover,
              category
         FROM blogs
        WHERE published = 1
        ORDER BY published_at DESC`
    );
    return rows.map(formatPostRow);
  },
  ["published-posts-v1"],
  { revalidate: 300, tags: ["blogs"] }
);

export const getPublishedPostBySlug = unstable_cache(
  async (slug) => {
    if (!slug) return null;
    const rows = await query(
      `SELECT id,
              slug,
              title,
              excerpt,
              author,
              DATE_FORMAT(published_at, '%b %e, %Y') AS date,
              read_time,
              views,
              comments,
              cover,
              category,
              content
         FROM blogs
        WHERE slug = ? AND published = 1
        LIMIT 1`,
      [slug]
    );
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      ...formatPostRow(row),
      content: row.content || "",
    };
  },
  ["published-post-by-slug-v1"],
  { revalidate: 300, tags: ["blogs"] }
);

export const getRelatedPosts = unstable_cache(
  async (slug, limit = 3) => {
    const safeLimit = Math.max(1, Math.min(12, Number(limit) || 3));
    const rows = await query(
      `SELECT slug, title, cover, category
         FROM blogs
        WHERE published = 1 AND slug <> ?
        ORDER BY published_at DESC
        LIMIT ${safeLimit}`,
      [slug]
    );
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      cover: r.cover || "/imgs/stories.avif",
      category: r.category || null,
    }));
  },
  ["related-posts-v1"],
  { revalidate: 300, tags: ["blogs"] }
);

