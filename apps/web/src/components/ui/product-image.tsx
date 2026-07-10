import { resolveImageUrl } from "@/lib/config";
import { BottlePlaceholder } from "@/components/brand/bottle";

const TONES = ["brand", "blue", "amber", "red", "lime"] as const;

export function ProductImage({
  imagePath,
  alt,
  seed = 0,
  className = "",
  imgClassName = "",
}: {
  imagePath?: string | null;
  alt: string;
  seed?: number;
  className?: string;
  imgClassName?: string;
}) {
  const url = resolveImageUrl(imagePath);
  if (url) {
    return (
      <div className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt}
          loading="lazy"
          className={`h-full w-full object-contain ${imgClassName}`}
        />
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
