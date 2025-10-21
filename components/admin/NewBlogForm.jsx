"use client";

import Dropzone from "@/components/ui/Dropzone";
import TinyMCEEditor from "@/components/admin/TinyMCEEditor";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaClock,
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

export default function NewBlogForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [dropzoneKey, setDropzoneKey] = useState(0);
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [readTime, setReadTime] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);

  const slugPreview = slugify(title);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let coverUrl = "";
      if (coverFile) {
        const fd = new FormData();
        fd.append("file", coverFile);
        const uploadRes = await fetch("/api/admin/uploads/cover", {
          method: "POST",
          body: fd,
        });
        const uploadJson = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok) {
          throw new Error(uploadJson?.error || "Failed to upload cover");
        }
        coverUrl = uploadJson?.url || "";
      }

      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slugPreview,
          excerpt,
          content,
          cover: coverUrl,
          category,
          author,
          readTime,
          published,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Failed to create blog");
      }

      toast.success(
        slugPreview
          ? `Blog created! View it at /blogs/${slugPreview}`
          : "Blog created!"
      );
      setTitle("");
      setExcerpt("");
      setCoverFile(null);
      setDropzoneKey((v) => v + 1);
      setCategory("");
      setAuthor("");
      setReadTime("");
      setContent("");
      setPublished(true);
      router.push("/admin/blogs");
    } catch (err) {
      toast.error(err?.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <section className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <header className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-900">Content</h2>
            <p className="text-sm text-neutral-500">
              Craft a clear narrative. Short paragraphs and descriptive headings
              improve readability.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <FaLink />
              <span>
                {slugPreview
                  ? `/blogs/${slugPreview}`
                  : "Generate a permalink automatically by adding a title."}
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
                placeholder="Give your blog post a memorable name"
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
                placeholder="Summarise the key takeaway shown on listings"
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
            </div>
          </div>
        </section>

        <aside className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Cover image
              </label>
              <Dropzone
                key={dropzoneKey}
                accept={{ "image/*": [] }}
                maxFiles={1}
                onChange={(files) => setCoverFile(files?.[0] || null)}
                description="Upload a 1200x675 image for best widescreen presentation."
                icon={<FaImage className="text-primary-500" />}
              />
              {coverFile ? (
                <p className="mt-2 text-xs text-neutral-500">
                  Selected:{" "}
                  <span className="font-medium text-neutral-700">
                    {coverFile.name}
                  </span>
                </p>
              ) : null}
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
                Toggle publish status to control visibility. You can edit
                content after publishing — the slug stays in sync with the
                title.
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
                />
                <span
                  className={classNames(
                    "relative mx-0.5 inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
                    published ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !title || !content}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Saving...
              </>
            ) : (
              <>
                <FaSave /> Publish post
              </>
            )}
          </button>
        </aside>
      </div>
    </form>
  );
}
