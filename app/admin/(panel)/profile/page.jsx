import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionWithUser } from "@/lib/auth";
import { query } from "@/lib/db";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaShieldAlt,
  FaUserCircle,
  FaUserEdit,
} from "react-icons/fa";

export const metadata = { title: "Profile | Admin" };

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value || null;
  const sess = await getSessionWithUser(token);
  if (!sess) redirect("/admin/login");
  const user = sess.user;

  let avatarUrl = null;
  let joinedAt = null;
  try {
    const rows = await query(
      `SELECT avatar_url, DATE_FORMAT(created_at, '%b %e, %Y') AS joined_at FROM users WHERE id = ?`,
      [user.id]
    );
    if (rows[0]) {
      avatarUrl = rows[0].avatar_url || null;
      joinedAt = rows[0].joined_at || null;
    }
  } catch {}

  let publishedCount = 0;
  let draftCount = 0;
  try {
    const statsRows = await query(
      `SELECT SUM(published = 1) AS published_count, SUM(published = 0) AS draft_count FROM blogs WHERE author = ?`,
      [user.name]
    );
    const stats = statsRows?.[0] || {};
    publishedCount = Number(stats.published_count || 0);
    draftCount = Number(stats.draft_count || 0);
  } catch {}
  const totalPosts = publishedCount + draftCount;

  const roleLabel =
    user.role === "admin"
      ? "Administrator"
      : user.role === "editor"
      ? "Editor"
      : "User";

  const initials = getInitials(user.name);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-inner">
              <FaUserCircle className="text-xl" />
            </span>
            <div>
              <h1 className="font-noticia text-3xl tracking-tight text-neutral-900">
                Your profile
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                Manage your account details and keep your profile information up to date.
              </p>
            </div>
          </div>
          <Link
            href="/admin/profile/edit"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
          >
            <FaUserEdit /> Edit profile
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex flex-col items-center sm:w-48">
              <div className="h-28 w-28 overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 shadow-inner">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={user.name}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-neutral-500">
                    {initials}
                  </div>
                )}
              </div>
              <span className="mt-3 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                {roleLabel}
              </span>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">{user.name}</h2>
                <p className="mt-1 inline-flex items-center gap-2 text-sm text-neutral-600">
                  <FaEnvelope className="text-neutral-400" />
                  {user.email}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <FaShieldAlt /> Role
                  </div>
                  <p className="mt-1 font-medium text-neutral-800">{roleLabel}</p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <FaCalendarAlt /> Joined
                  </div>
                  <p className="mt-1 font-medium text-neutral-800">{joinedAt || "—"}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-500">
                Your profile photo and details appear in the author attribution next to published articles.
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-neutral-800">Publishing impact</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                <span className="text-neutral-500">Total posts</span>
                <span className="text-base font-semibold text-neutral-800">{totalPosts}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <span className="text-emerald-600">Published</span>
                <span className="font-semibold text-emerald-700">{publishedCount}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
                <span className="text-amber-600">Drafts</span>
                <span className="font-semibold text-amber-700">{draftCount}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5 text-sm text-neutral-600 shadow-sm">
            <h3 className="text-sm font-semibold text-neutral-800">Account tips</h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>• Keep your email current so we can reach you when needed.</li>
              <li>• Refresh your avatar to give readers a face to the author.</li>
              <li>• Update your password regularly to keep your account secure.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
