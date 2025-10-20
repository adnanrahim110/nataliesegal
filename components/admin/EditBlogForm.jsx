"use client";

import Dropzone from "@/components/ui/Dropzone";
import TinyMCEEditor from "@/components/admin/TinyMCEEditor";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaClock,
  FaEye,
  FaImage,
  FaInfoCircle,
  FaLink,
  FaSave,
  FaUser,
} from "react-icons/fa";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function EditBlogForm({ initial }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [coverUrl, setCoverUrl] = useState(initial?.cover || "");
  const [coverFile, setCoverFile] = useState(null);
  const [dropzoneKey, setDropzoneKey] = useState(0);
  const [category, setCategory] = useState(initial?.category || "");
  const [author, setAuthor] = useState(initial?.author || "");
  const [readTime, setReadTime] = useState(
    initial?.read_time || initial?.readTime || ""
  );
  const [content, setContent] = useState(initial?.content || "");
  const [published, setPublished] = useState(Boolean(initial?.published));
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const slugPreview = slugify(title);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      let nextCover = coverUrl;
      if (coverFile) {
        const fd = new FormData();
        fd.append("file", coverFile);
        const up = await fetch("/api/admin/uploads/cover", {
          method: "POST",
          body: fd,
        });
        const uj = await up.json().catch(() => ({}));
        if (!up.ok) throw new Error(uj?.error || "Failed to upload cover");
        nextCover = uj?.url || coverUrl;
      }

      const res = await fetch(
        `/api/admin/blogs/${encodeURIComponent(initial.slug)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            slug: slugPreview,
            excerpt,
            content,
            cover: nextCover,
            category,
            author,
            readTime,
            published,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save changes");

      setFeedback({
        type: "success",
        text: "Changes saved successfully.",
      });
      setCoverUrl(nextCover);
      setCoverFile(null);
      setDropzoneKey((key) => key + 1);

      if (data?.slug && data.slug !== initial.slug) {
        router.replace(`/admin/edit/${encodeURIComponent(data.slug)}`);
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Failed to save changes",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm space-y-6">
          <header className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-900">Content</h2>
            <p className="text-sm text-neutral-500">
              Update the article title, summary, and main content. The slug
              updates automatically from the title.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <FaLink />
              <span>
                {slugPreview
                  ? `/blogs/${slugPreview}`
                  : "Add a title to generate the permalink automatically."}
              </span>
            </div>
          </header>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Title
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Edit the post title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Excerpt
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Refresh the summary shown on the listing page"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                Body
              </label>
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-inner">
                <TinyMCEEditor
                  id="blog-content-editor"
                  value={content}
                  onEditorChange={(value) => setContent(value)}
                />
              </div>
              <p className="text-xs text-neutral-500">
                Consider highlighting updates for returning readers or adding
                notes about what changed.
              </p>
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
              <FaImage className="text-primary-500" /> Cover image
            </div>
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/60 p-4">
              {coverUrl && !coverFile ? (
                <div className="mb-3 overflow-hidden rounded-xl border border-neutral-200">
                  <Image
                    src={coverUrl}
                    alt={title || "Cover image"}
                    width={480}
                    height={270}
                    className="h-32 w-full object-cover"
                  />
                </div>
              ) : null}
              <Dropzone key={dropzoneKey} onFile={setCoverFile} />
              <p className="mt-2 text-xs text-neutral-500">
                Recommended size: 1200×630px. JPG or PNG up to 5MB.
              </p>
              {coverFile?.name && (
                <p className="mt-1 text-xs text-neutral-600">
                  New file:{" "}
                  <span className="font-medium">{coverFile.name}</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Category
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Reflections, Essays"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Author
              </label>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <FaUser />
                </span>
                <input
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 pl-9 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Defaults to Admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Estimated read time
              </label>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <FaClock />
                </span>
                <input
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 pl-9 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="e.g. 5 min read"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-primary-500">
                <FaInfoCircle />
              </span>
              <p>
                Toggle publish status to control visibility. Remember to update
                the title or excerpt if you reposition the article.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3">
              <div>
                <p className="text-sm font-medium text-neutral-700">
                  {published ? "Published" : "Draft"}
                </p>
                <p className="text-xs text-neutral-500">
                  {published
                    ? "Visible to readers once saved"
                    : "Only admins can access this draft"}
                </p>
              </div>
              <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                <span
                  className={classNames(
                    "absolute inset-0 rounded-full border transition-all",
                    published
                      ? "border-primary-400 bg-primary-500"
                      : "border-neutral-300 bg-neutral-200"
                  )}
                ></span>
                <span
                  className={classNames(
                    "relative ml-1 inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
                    published ? "translate-x-5" : "translate-x-0"
                  )}
                ></span>
              </label>
            </div>
          </div>

          {feedback && (
            <div
              className={classNames(
                "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm",
                feedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-600"
              )}
            >
              <FaInfoCircle />
              <span>{feedback.text}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading || !title || !content}
              className="inline-flex flex-1 items-center justify-center gap-3 rounded-xl bg-primary-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save changes
                </>
              )}
            </button>
            {initial?.published ? (
              <Link
                href={`/blogs/${encodeURIComponent(initial.slug)}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
              >
                <FaEye className="text-xs" /> View live
              </Link>
            ) : null}
          </div>
        </aside>
      </div>
    </form>
  );
}
