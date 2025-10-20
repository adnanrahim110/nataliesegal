import EditBlogForm from "@/components/admin/EditBlogForm";
import { getSessionWithUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FaRegNewspaper } from "react-icons/fa";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const metadata = {
  title: "Edit Blog | Admin",
};

export default async function EditBlogPage({ params }) {
  const { slug } = await params;
  if (!slug) {
    redirect("/admin");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value || null;
  const sess = await getSessionWithUser(token);
  if (!sess || (sess.user?.role !== "admin" && sess.user?.role !== "editor")) {
    redirect("/admin/login");
  }

  const rows = await query(
    `SELECT id, slug, title, excerpt, content, cover, category, author,
            read_time, views, comments, published,
            DATE_FORMAT(published_at, '%Y-%m-%d %H:%i:%s') as published_at,
            DATE_FORMAT(updated_at, '%b %e, %Y %l:%i %p') as updated_at,
            DATE_FORMAT(published_at, '%b %e, %Y %l:%i %p') as published_display
       FROM blogs WHERE slug = ? LIMIT 1`,
    [slug]
  );
  if (rows.length === 0) {
    redirect("/admin");
  }
  const post = rows[0];

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-inner">
              <FaRegNewspaper className="text-xl" />
            </span>
            <div>
              <h1 className="font-noticia text-3xl tracking-tight text-neutral-900">
                Edit post
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                Updating “{post.title}”. Changes go live once you save.{" "}
                {post.published
                  ? "Readers currently see the published version."
                  : "This post is a draft."}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 text-xs text-neutral-500">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-medium text-neutral-600">
              <span className={classNames("h-2 w-2 rounded-full", post.published ? "bg-emerald-500" : "bg-amber-500")}></span>
              {post.published ? "Published" : "Draft"}
            </div>
            <span>Last updated {post.updated_at || "—"}</span>
            {post.published_display ? (
              <span>Originally published {post.published_display}</span>
            ) : null}
          </div>
        </div>
      </header>

      <EditBlogForm initial={post} />
    </div>
  );
}
