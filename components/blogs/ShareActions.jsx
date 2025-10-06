"use client";

import React, { useState } from "react";
import { FaLink, FaShareAlt } from "react-icons/fa";

export default function ShareActions({ title, excerpt, className = "" }) {
  const [status, setStatus] = useState("idle"); // idle | copied | error

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, text: excerpt, url: shareUrl });
        setStatus("idle");
      } else if (navigator.clipboard && shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        setStatus("copied");
        setTimeout(() => setStatus("idle"), 1500);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1500);
    }
  };

  const copyLink = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      if (!url) return;
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1500);
    }
  };

  return (
    <div className={["flex items-center gap-2", className].join(" ")}>
      <button
        type="button"
        onClick={handleShare}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
        aria-label="Share"
      >
        <FaShareAlt />
        {status === "copied" && (
          <span className="pointer-events-none absolute -top-7 whitespace-nowrap rounded-full bg-neutral-900 px-2 py-0.5 text-[11px] font-medium text-white shadow-md">
            Copied!
          </span>
        )}
        {status === "error" && (
          <span className="pointer-events-none absolute -top-7 whitespace-nowrap rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-medium text-white shadow-md">
            Failed
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-100"
        aria-label="Copy link"
      >
        <FaLink />
      </button>
    </div>
  );
}
