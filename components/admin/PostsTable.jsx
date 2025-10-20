"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaEye,
  FaFilter,
  FaSearch,
  FaSync,
  FaTrashAlt,
} from "react-icons/fa";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
];

export default function PostsTable() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blogs", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load posts");
      setPosts(Array.isArray(data.posts) ? data.posts : []);
    } catch (err) {
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const togglePublished = async (slug, current) => {
    const prev = posts;
    setPosts((arr) =>
      arr.map((p) =>
        p.slug === slug ? { ...p, published: current ? 0 : 1 } : p
      )
    );
    try {
      const res = await fetch(`/api/admin/blogs/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update");
    } catch (err) {
      setPosts(prev);
      alert(err.message || "Failed to update");
    }
  };

  const deletePost = async (slug) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const prev = posts;
    setPosts((arr) => arr.filter((p) => p.slug !== slug));
    try {
      const res = await fetch(`/api/admin/blogs/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete");
    } catch (err) {
      setPosts(prev);
      alert(err.message || "Failed to delete");
    }
  };

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && post.published) ||
        (statusFilter === "draft" && !post.published);
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        (post.category || "").toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [posts, search, statusFilter]);

  const showOverlay = loading && filteredPosts.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-neutral-500">
          <FaFilter className="text-xs" />
          <span className="text-sm">Filter posts</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Search title, slug, category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-neutral-700 shadow-inner focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            <FaSync className="text-xs" /> Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={[
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              statusFilter === filter.value
                ? "border-primary-200 bg-primary-50 text-primary-700"
                : "border-neutral-200 text-neutral-600 hover:bg-neutral-100",
            ].join(" ")}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading && posts.length === 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white/80 p-6 text-sm text-neutral-600">
          Loading posts...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && filteredPosts.length === 0 && !error && (
        <div className="rounded-2xl border border-neutral-200 bg-white/60 p-6 text-sm text-neutral-500">
          No posts match your filters.
        </div>
      )}

      {filteredPosts.length > 0 && (
        <>
          <div className="hidden md:block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm relative">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-500">
                <tr className="text-left">
                  <th className="py-3 pl-4 pr-6 font-medium">Title</th>
                  <th className="py-3 pr-6 font-medium">Category</th>
                  <th className="py-3 pr-6 font-medium">Status</th>
                  <th className="py-3 pr-6 font-medium">Slug</th>
                  <th className="py-3 pr-6 font-medium">Updated</th>
                  <th className="py-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredPosts.map((post) => (
                  <tr key={post.slug} className="hover:bg-neutral-50">
                    <td className="py-4 pl-4 pr-6 font-medium text-neutral-900">
                      <div className="flex flex-col gap-1">
                        <span>{post.title}</span>
                        <span className="text-xs text-neutral-500">
                          {post.date || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-6 text-neutral-600">
                      {post.category || "Uncategorised"}
                    </td>
                    <td className="py-4 pr-6">
                      <button
                        onClick={() =>
                          togglePublished(post.slug, post.published)
                        }
                        className={[
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                          post.published
                            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                            : "border-neutral-200 bg-neutral-50 text-neutral-600",
                        ].join(" ")}
                      >
                        {post.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="py-4 pr-6 font-mono text-[12px] text-neutral-500">
                      {post.slug}
                    </td>
                    <td className="py-4 pr-6 text-neutral-500">
                      {post.date || "—"}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/edit/${encodeURIComponent(post.slug)}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs xl:text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                        >
                          <FaEdit className="text-xs xl:text-sm" /> Edit
                        </Link>
                        <button
                          onClick={() => deletePost(post.slug)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs xl:text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                          <FaTrashAlt className="text-xs xl:text-sm" /> Delete
                        </button>
                        {post.published ? (
                          <Link
                            href={`/blogs/${encodeURIComponent(post.slug)}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs xl:text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                          >
                            <FaEye className="text-xs xl:text-sm" /> View
                          </Link>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showOverlay && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/65 backdrop-blur-sm">
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-primary-400 border-t-transparent"></span>
                <span className="text-sm font-medium text-neutral-600">
                  Refreshing posts…
                </span>
              </div>
            )}
          </div>

          <div className="relative space-y-3 md:hidden">
            {filteredPosts.map((post) => (
              <div
                key={post.slug}
                className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-neutral-900">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500">
                      {post.category || "Uncategorised"}
                    </p>
                  </div>
                  <button
                    onClick={() => togglePublished(post.slug, post.published)}
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      post.published
                        ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                        : "border-neutral-200 bg-neutral-50 text-neutral-600",
                    ].join(" ")}
                  >
                    {post.published ? "Published" : "Draft"}
                  </button>
                </div>
                <div className="mt-3 space-y-1 text-xs text-neutral-500">
                  <div>
                    <span className="font-medium text-neutral-600">Slug:</span>{" "}
                    {post.slug}
                  </div>
                  <div>
                    <span className="font-medium text-neutral-600">
                      Updated:
                    </span>{" "}
                    {post.date || "—"}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/edit/${encodeURIComponent(post.slug)}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                  >
                    <FaEdit className="text-xs" /> Edit
                  </Link>
                  <button
                    onClick={() => deletePost(post.slug)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                  >
                    <FaTrashAlt className="text-xs" /> Delete
                  </button>
                  {post.published ? (
                    <Link
                      href={`/blogs/${encodeURIComponent(post.slug)}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                    >
                      <FaEye className="text-xs" /> View
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}

            {showOverlay && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/75 backdrop-blur-sm">
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-primary-400 border-t-transparent"></span>
                <span className="text-sm font-medium text-neutral-600">
                  Refreshing posts…
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
