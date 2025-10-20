"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-10 text-sm text-neutral-500">
        Loading editor...
      </div>
    ),
  }
);

const DEFAULT_PLUGINS = [
  "advlist",
  "autolink",
  "lists",
  "link",
  "image",
  "charmap",
  "preview",
  "anchor",
  "searchreplace",
  "visualblocks",
  "code",
  "fullscreen",
  "insertdatetime",
  "media",
  "table",
  "wordcount",
];

const DEFAULT_TOOLBAR =
  "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code";

const TINYMCE_API_KEY = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "no-api-key";
const TINYMCE_SCRIPT_SRC = `https://cdn.tiny.cloud/1/${TINYMCE_API_KEY}/tinymce/6/tinymce.min.js`;

export default function TinyMCEEditor({
  init,
  value,
  onEditorChange,
  onChange,
  loadingFallback,
  ...props
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editorInit = useMemo(
    () => ({
      height: 420,
      menubar: false,
      skin: "oxide",
      content_css: "default",
      branding: false,
      promotion: false,
      plugins: DEFAULT_PLUGINS,
      toolbar: DEFAULT_TOOLBAR,
      ...init,
    }),
    [init]
  );

  if (!mounted) {
    return (
      loadingFallback || (
        <div className="flex items-center justify-center py-10 text-sm text-neutral-500">
          Loading editor...
        </div>
      )
    );
  }

  return (
    <Editor
      apiKey={TINYMCE_API_KEY}
      tinymceScriptSrc={TINYMCE_SCRIPT_SRC}
      value={value}
      onEditorChange={(content, editor) => {
        if (onEditorChange) onEditorChange(content, editor);
        if (onChange) onChange(content, editor);
      }}
      init={editorInit}
      {...props}
    />
  );
}
