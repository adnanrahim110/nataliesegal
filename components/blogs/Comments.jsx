"use client";

import Button from "@/components/ui/Button";
import { MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function getInitials(name = "Anonymous") {
  const parts = String(name).trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "A").join("") || "A";
}

function backgroundTone(name = "") {
  const palette = [
    "from-rose-500/90 to-rose-500/60",
    "from-amber-500/90 to-amber-500/60",
    "from-emerald-500/90 to-emerald-500/60",
    "from-sky-500/90 to-sky-500/60",
    "from-indigo-500/90 to-indigo-500/60",
    "from-fuchsia-500/90 to-fuchsia-500/60",
    "from-teal-500/90 to-teal-500/60",
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return palette[sum % palette.length];
}

export default function Comments({ slug, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const maxLen = 500;
  const trimmedMessage = useMemo(() => message.trim(), [message]);
  const isValid = trimmedMessage.length >= 2 && trimmedMessage.length <= maxLen;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const res = await fetch(`/api/blogs/${slug}/comments`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load comments");
        if (cancelled) return;
        const list = Array.isArray(data.comments) ? data.comments : [];
        setComments(list);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err?.message || "Failed to load comments");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (slug) load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    const count = comments.length;
    onCountChange?.(count);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("blog:engagement-update", {
          detail: { slug, count },
        })
      );
    }
  }, [comments.length, slug, onCountChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = trimmedMessage;
    if (trimmed.length < 2) {
      setError("Please write at least 2 characters.");
      return;
    }
    if (trimmed.length > maxLen) {
      setError(`Please keep it under ${maxLen} characters.`);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/blogs/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to post comment");
      const comment = data?.comment;
      setComments((prev) => {
        const next = comment ? [comment, ...prev] : prev;
        return next;
      });
      setMessage("");
    } catch (err) {
      setError(err?.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-3xl border border-primary-100/70 bg-gradient-to-br from-primary-50 via-white to-white p-6 shadow-lg shadow-primary-500/10">
        <div className="absolute -left-20 top-1/2 hidden h-32 w-32 -translate-y-1/2 rounded-full bg-primary-200/40 blur-2xl lg:block" />
        <div className="absolute -right-12 top-2 h-16 w-16 rounded-full bg-emerald-200/40 blur-xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg shadow-primary-500/40">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600">
                Community
              </p>
              <h3 className="font-noticia text-xl text-neutral-900 md:text-2xl">
                Join the conversation
              </h3>
            </div>
          </div>
          <div className="rounded-full border border-primary-100 bg-white px-4 py-1.5 text-sm font-medium text-primary-700 shadow-sm">
            {comments.length} comment{comments.length === 1 ? "" : "s"}
          </div>
        </div>
        <p className="relative mt-3 max-w-2xl text-sm text-neutral-600">
          Share your reflections, highlight favorite lines, or continue the
          thread. Thoughtful, respectful dialogue keeps the story alive.
        </p>
      </header>

      {loading ? (
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/90 px-5 py-4 text-sm text-neutral-600 shadow-sm">
          <span className="h-3 w-3 animate-ping rounded-full bg-primary-500/80" />
          Loading comments...
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600 shadow-sm">
          {loadError}
        </div>
      ) : comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className="group relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/95 p-5 shadow-md shadow-primary-500/5 transition-transform hover:-translate-y-[2px] hover:shadow-lg"
            >
              <span className="pointer-events-none absolute -top-16 left-24 h-28 w-28 rounded-full bg-primary-200/20 blur-3xl transition-opacity group-hover:opacity-80" />
              <div className="relative flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${backgroundTone(
                    c.name
                  )} text-sm font-semibold text-white shadow-md shadow-black/20`}
                >
                  {getInitials(c.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold text-neutral-900">
                      {c.name}
                    </div>
                    <div className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                      {formatDate(c.createdAt)}
                    </div>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-neutral-700">
                    {c.message}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/90 px-6 py-10 text-center text-sm text-neutral-500 shadow-sm">
          Be the first to respond — your perspective could spark the next
          insight.
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-primary-100/80 bg-gradient-to-br from-white via-primary-50/60 to-white p-[1px] shadow-lg shadow-primary-500/10">
        <form
          onSubmit={handleSubmit}
          className="rounded-[calc(1.5rem-1px)] bg-white/95 px-6 py-6 shadow-inner shadow-white/40 backdrop-blur-sm md:px-8 md:py-8"
          noValidate
        >
          <div className="grid gap-4">
            <div>
              <label
                htmlFor="c-name"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500"
              >
                Name (optional)
              </label>
              <input
                id="c-name"
                type="text"
                placeholder="e.g., Natalie"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
              />
            </div>
            <div>
              <label
                htmlFor="c-message"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500"
              >
                Comment
              </label>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60">
                <textarea
                  id="c-message"
                  placeholder="Share your reflections..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  maxLength={maxLen}
                  aria-invalid={!isValid}
                  aria-describedby="c-message-help c-message-err"
                  className="min-h-32 w-full rounded-2xl bg-transparent px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
                <span id="c-message-help" className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-primary-500" /> Keep it
                  thoughtful and kind.
                </span>
                <span>
                  {trimmedMessage.length}/{maxLen}
                </span>
              </div>
              {error && (
                <p id="c-message-err" className="mt-1 text-xs text-red-600">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              type="submit"
              tone="dark"
              className="px-6 py-2 disabled:cursor-not-allowed disabled:opacity-60"
              contentClassName="font-serif tracking-wide"
              disabled={submitting || !isValid}
            >
              {submitting ? "Posting..." : "Post comment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
