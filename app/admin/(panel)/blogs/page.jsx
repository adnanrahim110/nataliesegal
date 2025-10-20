import PostsTable from "@/components/admin/PostsTable";
import { getSessionWithUser } from "@/lib/auth";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = { title: "Blogs | Admin" };

export default async function BlogsListAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value || null;
  const sess = await getSessionWithUser(token);
  if (!sess) redirect("/admin/login");
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-noticia text-3xl tracking-tight text-neutral-900">
              Manage posts
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Review, publish, or archive your articles from one place.
            </p>
          </div>
          <Link
            href="/admin/add-blog"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm xl:text-base tracking-wide font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            Create new post
          </Link>
        </div>
      </header>

      <section className="rounded-3xl border border-neutral-200 bg-white/90 p-4 shadow-sm">
        <PostsTable />
      </section>
    </div>
  );
}
