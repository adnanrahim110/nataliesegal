"use client";

import { useEffect, useMemo, useState } from "react";
import { Share2, Link as LinkIcon } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function BlogSharePanel({ title, excerpt, variant = "inline" }) {
  const [shareUrl, setShareUrl] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const buttonBase = useMemo(() => {
    const base =
      "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200";
    if (variant === "card") {
      return `${base} border-white/40 bg-white/90 text-neutral-700 hover:bg-white hover:text-primary-700`;
    }
    return `${base} border-neutral-200 bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-700`;
  }, [variant]);

  const showFeedback = (message) => {
    setFeedback(message);
    if (message) {
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  const copyLink = async () => {
    try {
      if (!shareUrl) return;
      await navigator.clipboard.writeText(shareUrl);
      showFeedback("Link copied");
    } catch {
      showFeedback("Copy failed");
    }
  };

  const openWindow = (url) => {
    if (!url) return copyLink();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleFacebook = () => {
    if (!shareUrl) return;
    openWindow(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    );
  };

  const handleLinkedIn = () => {
    if (!shareUrl) return;
    openWindow(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    );
  };

  const handleInstagram = () => {
    copyLink();
  };

  const handleNative = async () => {
    if (typeof window === "undefined") return;
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: excerpt || title,
          url: shareUrl,
        });
        showFeedback("");
      } else {
        await copyLink();
      }
    } catch {
      showFeedback("Share cancelled");
    }
  };

  return (
    <div
      className={[
        variant === "card"
          ? "rounded-3xl border border-white/30 bg-gradient-to-br from-white/10 via-white/20 to-white/5 p-6 shadow-xl shadow-primary-500/10 backdrop-blur"
          : "space-y-3",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <span
            className={
              variant === "card"
                ? "text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70"
                : "text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500"
            }
          >
            Share this article
          </span>
          <p
            className={
              variant === "card"
                ? "mt-2 text-sm text-white/85"
                : "mt-1 text-sm text-neutral-600"
            }
          >
            Keep the conversation going across your favourite networks.
          </p>
        </div>
        {feedback ? (
          <span
            className={
              variant === "card"
                ? "text-xs font-medium text-white/80"
                : "text-xs font-medium text-primary-600"
            }
          >
            {feedback}
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleFacebook}
          className={buttonBase}
          aria-label="Share on Facebook"
        >
          <FaFacebookF />
        </button>
        <button
          type="button"
          onClick={handleInstagram}
          className={buttonBase}
          aria-label="Copy link for Instagram"
        >
          <FaInstagram />
        </button>
        <button
          type="button"
          onClick={handleLinkedIn}
          className={buttonBase}
          aria-label="Share on LinkedIn"
        >
          <FaLinkedinIn />
        </button>
        <button
          type="button"
          onClick={handleNative}
          className={buttonBase}
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={copyLink}
          className={buttonBase}
          aria-label="Copy link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
