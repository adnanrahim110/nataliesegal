import { getSessionWithUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FaArrowRight,
  FaChartLine,
  FaCheck,
  FaClock,
  FaEdit,
  FaEye,
  FaFileAlt,
  FaPlus,
} from "react-icons/fa";

export const metadata = {
  title: "Dashboard | Admin",
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value || null;
  const sess = await getSessionWithUser(token);
  if (!sess || (sess.user?.role !== "admin" && sess.user?.role !== "editor")) {
    redirect("/admin/login");
  }

  const [{ total }] = await query(`SELECT COUNT(*) AS total FROM blogs`);
  const [{ published }] = await query(
    `SELECT COUNT(*) AS published FROM blogs WHERE published = 1`
  );
  const [{ drafts }] = await query(
    `SELECT COUNT(*) AS drafts FROM blogs WHERE published = 0`
  );
  const recent = await query(
    `SELECT slug, title, category, published, DATE_FORMAT(updated_at, '%b %e, %Y') as updated
       FROM blogs ORDER BY updated_at DESC, id DESC LIMIT 8`
  );

  const publicationRate = total ? Math.round((published / total) * 100) : 0;
  const adminName = sess.user?.name || "Admin";
  const lastUpdated = recent?.[0]?.updated || null;

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-500">
              Hello, {adminName.split(" ")[0]} 👋
            </p>
            <h1 className="mt-2 font-noticia text-4xl tracking-tight text-neutral-900">
              Content overview
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Monitor performance and jump back into your publishing workflow.
              {lastUpdated ? (
                <span className="font-medium text-neutral-600">
                  {" "}Last update {lastUpdated}.
                </span>
              ) : null}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/add-blog"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              <FaPlus />
              New post
            </Link>
            <Link
              href="/admin/blogs"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
            >
              <FaFileAlt />
              Manage posts
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-neutral-200 bg-white/90 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                Total posts
              </p>
              <div className="mt-3 text-3xl font-semibold text-neutral-900">
                {total}
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                {published} published · {drafts} drafts
              </p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-inner">
              <FaFileAlt className="text-lg" />
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
            <FaChartLine className="text-primary-500" />
            <span>Publishing efficiency {publicationRate}%</span>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white/90 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                Published
              </p>
              <div className="mt-3 text-3xl font-semibold text-neutral-900">
                {published}
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                {total
                  ? `${publicationRate}% of your catalog`
                  : "Publish your first post to see insights"}
              </p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner">
              <FaCheck className="text-lg" />
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white/90 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                Drafts
              </p>
              <div className="mt-3 text-3xl font-semibold text-neutral-900">
                {drafts}
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                {drafts
                  ? "Review pending ideas to keep momentum"
                  : "No drafts awaiting review"}
              </p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-inner">
              <FaClock className="text-lg" />
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-3xl border border-neutral-200 bg-white/90 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                Recent posts
              </h2>
              <p className="text-xs text-neutral-500">
                Latest updates to your publication
              </p>
            </div>
            <Link
              href="/admin/blogs"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
            >
              View all
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl px-2 pb-3 pt-2">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-neutral-500">
                  <th className="py-3 pl-4 pr-6 font-medium">Title</th>
                  <th className="py-3 pr-6 font-medium">Category</th>
                  <th className="py-3 pr-6 font-medium">Status</th>
                  <th className="py-3 pr-6 font-medium">Updated</th>
                  <th className="py-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recent.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-sm text-neutral-500"
                    >
                      No posts yet. Create your first article to populate the dashboard.
                    </td>
                  </tr>
                ) : (
                  recent.map((r) => (
                    <tr key={r.slug} className="hover:bg-neutral-50">
                      <td className="py-4 pl-4 pr-6 font-medium text-neutral-900">
                        <div className="flex flex-col gap-1">
                          <span>{r.title}</span>
                          <span className="text-xs text-neutral-500">
                            /blogs/{r.slug}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 pr-6">
                        <span className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600">
                          {r.category || "Uncategorised"}
                        </span>
                      </td>
                      <td className="py-4 pr-6">
                        {r.published ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                            <FaCheck className="text-xs" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
                            <FaClock className="text-xs" /> Draft
                          </span>
                        )}
                      </td>
                      <td className="py-4 pr-6 text-sm text-neutral-500">
                        {r.updated}
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/edit/${encodeURIComponent(r.slug)}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                          >
                            <FaEdit className="text-xs" /> Edit
                          </Link>
                          {r.published && (
                            <Link
                              href={`/blogs/${encodeURIComponent(r.slug)}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                            >
                              <FaEye className="text-xs" /> View
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-neutral-200 bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Quick actions</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Shortcuts to keep work moving
            </p>
            <div className="mt-4 space-y-3">
              <Link
                href="/admin/add-blog"
                className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
              >
                <span className="inline-flex items-center gap-2">
                  <FaPlus className="text-xs" /> Create new post
                </span>
                <FaArrowRight className="text-xs" />
              </Link>
              <Link
                href="/admin/blogs"
                className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
              >
                <span className="inline-flex items-center gap-2">
                  <FaFileAlt className="text-xs" /> Review all posts
                </span>
                <FaArrowRight className="text-xs" />
              </Link>
              <Link
                href="/admin/profile/edit"
                className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
              >
                <span className="inline-flex items-center gap-2">
                  <FaEdit className="text-xs" /> Update profile
                </span>
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Publishing tips</h2>
            <ul className="mt-3 space-y-3 text-xs text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500" />
                Keep drafts fresh by revisiting them weekly.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500" />
                Use descriptive cover imagery to boost engagement.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500" />
                Share published stories across your channels.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
