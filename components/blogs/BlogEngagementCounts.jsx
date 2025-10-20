"use client";

import { useEffect, useState } from "react";
import { Eye, MessageCircle } from "lucide-react";

const VIEW_CACHE_KEY = "blog:view-tracker";
const VIEW_CACHE_TTL = 1000 * 60 * 60; // 1 hour

export default function BlogEngagementCounts({
  slug,
  initialViews = 0,
  initialComments = 0,
  variant = "header",
}) {
  const [views, setViews] = useState(initialViews);
  const [comments, setComments] = useState(initialComments);

  useEffect(() => {
    setViews(initialViews);
  }, [initialViews]);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    let cancelled = false;
    async function incrementView() {
      const now = Date.now();
      let shouldIncrement = true;
      let existingCache = null;

      if (typeof window !== "undefined") {
        try {
          const raw = window.localStorage.getItem(VIEW_CACHE_KEY);
          const cache = raw ? JSON.parse(raw) : {};
          existingCache = cache;
          const lastSeen = cache?.[slug];
          if (lastSeen && now - Number(lastSeen) < VIEW_CACHE_TTL) {
            shouldIncrement = false;
          }
        } catch {
          existingCache = null;
        }
      }

      if (!shouldIncrement) return;

      try {
        const res = await fetch(`/api/blogs/${slug}/view`, { method: "POST" });
        const data = await res.json();
        if (!cancelled && res.ok) {
          const nextViews = Number(data?.views);
          if (!Number.isNaN(nextViews)) setViews(nextViews);
          if (typeof window !== "undefined") {
            try {
              const nextCache = existingCache || {};
              nextCache[slug] = now;
              window.localStorage.setItem(VIEW_CACHE_KEY, JSON.stringify(nextCache));
            } catch {
              // ignore storage errors
            }
          }
        }
      } catch {
        // ignore
      }
    }
    if (slug) incrementView();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    const handler = (event) => {
      const detail = event?.detail;
      if (!detail || detail.slug !== slug) return;
      if (typeof detail.count === "number") {
        setComments(detail.count);
      }
      if (typeof detail.views === "number") {
        setViews(detail.views);
      }
    };
    window.addEventListener("blog:engagement-update", handler);
    return () => window.removeEventListener("blog:engagement-update", handler);
  }, [slug]);

  if (variant === "card") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-2xl border border-white/50 bg-gradient-to-br from-white/90 via-white to-white/80 px-4 py-4 shadow-lg shadow-primary-500/10 backdrop-blur">
          <div className="flex items-center gap-3 text-neutral-600">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <Eye className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Views</p>
              <p className="text-sm font-medium text-neutral-800">Total readers</p>
            </div>
          </div>
          <span className="text-xl font-semibold text-neutral-900">
            {Number(views || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-white/50 bg-gradient-to-br from-white/90 via-white to-white/80 px-4 py-4 shadow-lg shadow-emerald-500/10 backdrop-blur">
          <div className="flex items-center gap-3 text-neutral-600">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Comments</p>
              <p className="text-sm font-medium text-neutral-800">Join the discussion</p>
            </div>
          </div>
          <span className="text-xl font-semibold text-neutral-900">
            {Number(comments || 0).toLocaleString()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-sm text-white/90 ring-1 ring-white/20">
        <Eye className="h-4 w-4 opacity-80" />
        <span>{Number(views || 0).toLocaleString()}</span>
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-sm text-white/90 ring-1 ring-white/20">
        <MessageCircle className="h-4 w-4 opacity-80" />
        <span>{Number(comments || 0).toLocaleString()}</span>
      </span>
    </>
  );
}
