"use client";

import Link from "next/link";
import { useState } from "react";
import type { CategoryDto } from "@alsayed/shared-types";
import { ArrowRight } from "@/components/brand/icons";
import { resolveImageUrl } from "@/lib/config";

const CARD_BACKGROUNDS = [
  "from-[#087a9a] via-[#07577f] to-[#062b58]",
  "from-[#ff9b16] via-[#eb6410] to-[#a83408]",
  "from-[#e31b13] via-[#9c0508] to-[#480106]",
  "from-[#713313] via-[#351608] to-[#160904]",
] as const;

function ImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-white/75">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
          <svg
            viewBox="0 0 24 24"
            className="h-9 w-9"
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
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
          Image coming soon
        </span>
      </div>
    </div>
  );
}

export function CategoryCard({
  category,
  seed = 0,
}: {
  category: CategoryDto;
  seed?: number;
}) {
  const count = category.productCount ?? 0;
  const imageUrl = resolveImageUrl(category.imagePath);
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`group relative block h-[280px] overflow-hidden rounded-[18px] bg-gradient-to-br shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-hover ${CARD_BACKGROUNDS[seed % CARD_BACKGROUNDS.length]}`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl!}
          alt={category.title}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <ImagePlaceholder />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />

      <div className="relative flex h-full flex-col p-5 text-white sm:p-6">
        <h3 className="max-w-[65%] font-serif text-[1.65rem] leading-[1.08] font-bold drop-shadow-sm">
          {category.title}
        </h3>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/85">
          {count.toString().padStart(2, "0")} Product{count === 1 ? "" : "s"}
        </p>

        <span className="mt-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-lg transition-all duration-300 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-white">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
