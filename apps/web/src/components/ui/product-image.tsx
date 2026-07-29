"use client";

import { useState } from "react";
import { resolveImageUrl } from "@/lib/config";
import { BottlePlaceholder } from "@/components/brand/bottle";

const TONES = ["brand", "blue", "amber", "red", "lime"] as const;

export function ProductImage({
  imagePath,
  alt,
  seed = 0,
  className = "",
  imgClassName = "",
  placeholder = "bottle",
  fit = "contain",
}: {
  imagePath?: string | null;
  alt: string;
  seed?: number;
  className?: string;
  imgClassName?: string;
  placeholder?: "bottle" | "image";
  fit?: "contain" | "cover";
}) {
  const url = resolveImageUrl(imagePath);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (url && failedUrl !== url) {
    return (
      <div className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt}
          loading="lazy"
          onError={() => setFailedUrl(url)}
          className={`h-full w-full ${
            fit === "cover" ? "object-cover" : "object-contain"
          } ${imgClassName}`}
        />
      </div>
    );
  }

  if (placeholder === "image") {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-2 text-primary/55">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/15 bg-white/45">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="8.5" cy="9" r="1.5" />
              <path d="m4 17 4.5-4.5 3.5 3 2.5-2.5 5.5 5" />
            </svg>
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.16em]">
            Image coming soon
          </span>
        </div>
      </div>
    );
  }

  const tone = TONES[seed % TONES.length];
  return (
    <div className={className}>
      <BottlePlaceholder
        tone={tone}
        className={`h-full w-auto max-h-full ${imgClassName}`}
      />
    </div>
  );
}
