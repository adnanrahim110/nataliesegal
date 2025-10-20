"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Eye, Heart, MessageCircle, Share2 } from "lucide-react";

function HeartBurst({ seed = 0 }) {
  const dots = Array.from({ length: 8 });
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {dots.map((_, i) => {
        const angle = (i / dots.length) * Math.PI * 2;
        const dx = Math.cos(angle) * 14;
        const dy = Math.sin(angle) * 14;
        return (
          <motion.span
            key={`${seed}-${i}`}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.4], x: dx, y: dy }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute h-1.5 w-1.5 rounded-full bg-red-500"
          />
        );
      })}
    </span>
  );
}

export default function BlogCard({ post, delay = 0 }) {
  const [like, setLike] = useState({ liked: false, count: 0 });
  const [burstSeed, setBurstSeed] = useState(0);
  const [shareState, setShareState] = useState("idle"); // idle | copied | error

  // Load per-post like from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("blogLikes");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed[post.id]) setLike(parsed[post.id]);
      }
    } catch {}
  }, [post.id]);

  const toggleLike = () => {
    setLike((prev) => {
      const liked = !prev.liked;
      const nextCount = Math.max(0, (prev.count || 0) + (liked ? 1 : -1));
      const next = { liked, count: nextCount };
      try {
        const stored = localStorage.getItem("blogLikes");
        const all = stored ? JSON.parse(stored) : {};
        all[post.id] = next;
        localStorage.setItem("blogLikes", JSON.stringify(all));
      } catch {}
      if (liked) setBurstSeed((s) => s + 1);
      return next;
    });
  };

  const handleShare = async () => {
    const shareUrl =
      post.href || (typeof window !== "undefined" ? window.location.href : "");
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: shareUrl,
        });
        setShareState("idle");
      } else if (navigator.clipboard && shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        setShareState("copied");
        setTimeout(() => setShareState("idle"), 1600);
      }
    } catch {
      setShareState("error");
      setTimeout(() => setShareState("idle"), 1600);
    }
  };

  const authorInitials = useMemo(() => {
    if (!post?.author) return "";
    const parts = String(post.author).trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }, [post?.author]);

  const viewsDisplay = useMemo(
    () => Number(post?.views || 0).toLocaleString(),
    [post?.views]
  );
  const commentsDisplay = useMemo(
    () => Number(post?.comments || 0).toLocaleString(),
    [post?.comments]
  );

  return (
    <div className="group/card relative rounded-3xl p-[1.5px] bg-gradient-to-tr from-primary-500/20 via-transparent to-primary-400/10">
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay }}
        className="overflow-hidden rounded-[calc(1.5rem-1.5px)] border border-neutral-200 bg-white ring-1 ring-black/5 shadow-sm transition-all duration-300 group-hover/card:shadow-md group-hover/card:-translate-y-0.5"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes="(min-width: 1280px) 380px, (min-width: 1024px) 420px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {post.href ? (
            <Link
              href={post.href}
              className="absolute inset-0"
              aria-label={`Open post: ${post.title}`}
            />
          ) : null}
        </div>

        <div className="p-3">
          {post.category ? (
            <div className="mb-1.5 text-[11px] uppercase tracking-[0.14em] text-neutral-500">
              {post.category}
            </div>
          ) : null}
          <Link href={post.href || "#"} className="group/title inline-block">
            <h3 className="relative font-noticia text-[1.5rem] md:text-[22px] tracking-tight text-neutral-900 transition-colors group-hover/title:text-primary-500">
              {post.title}
              <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300 group-hover/title:w-full" />
            </h3>
          </Link>
          <p className="mt-2 text-neutral-700/90 text-sm md:text-[0.95rem] leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
          {post.href ? (
            <Link
              href={post.href}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors group/read"
            >
              Read more
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/read:translate-x-0.5" />
            </Link>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-neutral-700">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-700 ring-1 ring-black/5">
              {authorInitials}
            </span>
            <span className="font-medium">{post.author}</span>
            <span className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>{post.date}</span>
            {post.readTime ? (
              <>
                <span className="h-1 w-1 rounded-full bg-neutral-300" />
                <span>{post.readTime}</span>
              </>
            ) : null}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-4">
            <div className="flex items-center gap-4 text-neutral-600">
              <span className="inline-flex items-center gap-1.5 text-sm">
                <Eye className="h-4 w-4 opacity-80" />
                <span>{viewsDisplay}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm">
                <MessageCircle className="h-4 w-4 opacity-80" />
                <span>{commentsDisplay}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <button
                  type="button"
                  aria-label="Like"
                  aria-pressed={like.liked}
                  onClick={toggleLike}
                  className={[
                    "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all",
                    like.liked
                      ? "border-red-200 bg-red-50 text-red-600 shadow-sm"
                      : "border-neutral-200 bg-white text-neutral-700 hover:bg-red-50 hover:text-red-600",
                  ].join(" ")}
                >
                  <Heart
                    className="h-4 w-4"
                    fill={like.liked ? "currentColor" : "none"}
                  />
                </button>
                {burstSeed > 0 && like.liked && (
                  <HeartBurst seed={`${post.id}-${burstSeed}`} />
                )}
              </div>
              <span
                className={[
                  "min-w-5 text-sm tabular-nums",
                  like.liked ? "text-red-600" : "text-neutral-700",
                ].join(" ")}
              >
                {like.count}
              </span>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share"
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
                >
                  <Share2 className="h-4 w-4" />
                {shareState === "copied" && (
                  <span className="pointer-events-none absolute -top-7 whitespace-nowrap rounded-full bg-neutral-900 px-2 py-0.5 text-[11px] font-medium text-white shadow-md">
                    Copied!
                  </span>
                )}
                {shareState === "error" && (
                  <span className="pointer-events-none absolute -top-7 whitespace-nowrap rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-medium text-white shadow-md">
                    Failed
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
