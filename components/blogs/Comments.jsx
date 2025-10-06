"use client";

import Button from "@/components/ui/Button";
import { useEffect, useMemo, useState } from "react";
import { FaRegComment } from "react-icons/fa";

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

function colorForName(name = "") {
  const palette = [
    "bg-rose-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-sky-500",
    "bg-indigo-500",
    "bg-fuchsia-500",
    "bg-teal-500",
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return palette[sum % palette.length];
}

export default function Comments({ slug }) {
  const storageKey = useMemo(() => `comments:${slug}`, [slug]);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setComments(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  const save = (next) => {
    setComments(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  };

  const maxLen = 500;
  const isValid = message.trim().length >= 2 && message.trim().length <= maxLen;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = message.trim();
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
    const newComment = {
      id: Date.now(),
      name: name.trim() || "Anonymous",
      message: trimmed,
      createdAt: new Date().toISOString(),
    };
    // Simulate async to allow subtle UX feedback later
    setTimeout(() => {
      const next = [newComment, ...comments];
      save(next);
      setMessage("");
      // keep name for convenience
      setSubmitting(false);
    }, 200);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="relative inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-primary-700 ring-1 ring-primary-100">
          <FaRegComment />
          <span className="text-xs tracking-wide uppercase">Comments</span>
          <span className="ml-2 rounded-full bg-primary-600/10 px-2 py-0.5 text-[11px] font-medium text-primary-700 ring-1 ring-primary-200/50">
            {comments.length}
          </span>
          <span className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-gradient-to-r from-primary-100/40 via-transparent to-transparent blur-xl" />
        </div>
        <h3 className="mt-2 font-noticia text-2xl tracking-tight">
          Join the conversation
        </h3>
        <div className="mt-2 h-px w-full max-w-3xl bg-gradient-to-r from-primary-200/70 via-neutral-200/60 to-transparent" />
      </div>

      {comments.length > 0 && (
        <ul className="mb-6 space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className="rounded-2xl p-[1px] bg-gradient-to-br from-primary-200/60 via-transparent to-transparent"
            >
              <div className="rounded-2xl border border-neutral-200/10 bg-white/80 p-4 shadow-sm ring-1 ring-black/[0.02] backdrop-blur">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${colorForName(
                      c.name
                    )}`}
                  >
                    {getInitials(c.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="truncate font-semibold text-neutral-900">
                        {c.name}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {formatDate(c.createdAt)}
                      </div>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap leading-relaxed text-neutral-800">
                      {c.message}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Form with gradient border and glass effect */}
      <div className="rounded-2xl p-[1px] bg-gradient-to-br from-primary-200/60 via-neutral-100/60 to-transparent">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-neutral-200/10 bg-white/80 p-4 shadow-sm shadow-black/5 ring-1 ring-black/[0.02] backdrop-blur md:p-5"
          noValidate
        >
          <div className="space-y-4">
            <div className="flex flex-col">
              <label
                htmlFor="c-name"
                className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-600"
              >
                Name (optional)
              </label>
              <input
                id="c-name"
                type="text"
                placeholder="e.g., Natalie"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-neutral-200 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="c-message"
                className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-600"
              >
                Comment
              </label>
              <textarea
                id="c-message"
                placeholder="Write your comment..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={maxLen}
                aria-invalid={!isValid}
                aria-describedby="c-message-help c-message-err"
                className="min-h-28 resize-y rounded-lg border border-neutral-200 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
                <span id="c-message-help">Be respectful. No markdown.</span>
                <span>
                  {message.trim().length}/{maxLen}
                </span>
              </div>
              {error && (
                <p id="c-message-err" className="mt-1 text-xs text-red-600">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              tone="dark"
              className="px-6 py-2 disabled:cursor-not-allowed disabled:opacity-60"
              contentClassName="font-serif"
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
