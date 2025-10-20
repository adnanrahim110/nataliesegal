"use client";

import { useCallback, useRef, useState } from "react";

export default function Dropzone({
  onFile,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
}) {
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    (files) => {
      const f = files?.[0];
      if (!f) return;
      if (f.size > maxSize) {
        alert("File too large (max 5MB)");
        return;
      }
      setPreview(URL.createObjectURL(f));
      onFile?.(f);
    },
    [maxSize, onFile]
  );

  return (
    <div
      className={[
        "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all",
        drag
          ? "border-primary-500 bg-primary-50/40"
          : "border-neutral-300 hover:bg-neutral-50/60",
      ].join(" ")}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
    >
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="h-24 w-24 rounded-full object-cover ring-2 ring-primary-500"
        />
      ) : (
        <>
          <div className="rounded-full bg-gradient-to-br from-primary-600 to-primary-400 p-3 text-white shadow-md">
            📁
          </div>
          <p className="mt-2 text-sm">Drag & drop or click to upload avatar</p>
          <p className="text-xs text-neutral-600">PNG, JPG up to 5MB</p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
