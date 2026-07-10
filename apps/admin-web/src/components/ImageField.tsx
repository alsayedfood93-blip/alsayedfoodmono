"use client";

import { useEffect, useState } from "react";
import { resolveImageUrl } from "@/lib/config";

/**
 * Image picker with live preview. Reports the selected File to the parent and
 * shows either the newly-selected preview or the existing stored image.
 */
export function ImageField({
  label = "Image",
  currentPath,
  onChange,
}: {
  label?: string;
  currentPath?: string | null;
  onChange: (file: File | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const existing = resolveImageUrl(currentPath);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleFile(file: File | null) {
    if (preview) URL.revokeObjectURL(preview);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
    onChange(file);
  }

  const shown = preview ?? existing;

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 flex-none items-center justify-center overflow-hidden rounded-xl border border-ink/10 bg-brand-50">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={shown}
              alt="preview"
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-xs text-muted">No image</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="inline-flex cursor-pointer items-center rounded-lg border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-brand-300">
            Choose image
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {preview && (
            <button
              type="button"
              onClick={() => handleFile(null)}
              className="text-left text-xs font-medium text-red-600 hover:underline"
            >
              Clear selection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
