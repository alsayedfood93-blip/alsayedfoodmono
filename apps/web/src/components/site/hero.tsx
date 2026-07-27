import Link from "next/link";
import type { HeroContentDto } from "@alsayed/shared-types";
import { ArrowRight, LeafIcon } from "@/components/brand/icons";
import { resolveImageUrl } from "@/lib/config";
import { HeroBackgroundSlider } from "./hero-background-slider";

export function Hero({ hero }: { hero: HeroContentDto | null }) {
  const eyebrow = hero?.eyebrow ?? "Purpose-driven beverages";
  const title = hero?.title ?? "Every sip";
  const highlight = hero?.highlightedText ?? "carries meaning.";
  const description =
    hero?.description ??
    "Premium beverages crafted with care, delivered with purpose.";
  const primaryText = hero?.primaryButtonText ?? "Explore Products";
  const primaryLink = hero?.primaryButtonLink ?? "/products";
  const secondaryText = hero?.secondaryButtonText ?? "View Categories";
  const secondaryLink = hero?.secondaryButtonLink ?? "/#categories";

  const backgroundImages = (hero?.images ?? [])
    .map((image) => {
      const src = resolveImageUrl(image.imagePath);
      if (!src) return null;
      return { id: image.id, src };
    })
    .filter((image): image is { id: number; src: string } => image !== null);

  return (
    <section className="relative isolate min-h-[70svh] overflow-hidden text-white sm:min-h-[75vh] md:min-h-[85vh] lg:min-h-[90vh]">
      <HeroBackgroundSlider images={backgroundImages} />

      <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-7xl flex-col justify-center px-5 py-12 sm:min-h-[75vh] sm:py-14 md:min-h-[85vh] md:px-8 md:py-20 lg:min-h-[90vh]">
        <div className="animate-fade-up mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-badge border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            <LeafIcon className="h-3.5 w-3.5" />
            {eyebrow}
          </span>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
            <br />
            <span className="text-mint">{highlight}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-water sm:text-lg lg:mx-0">
            {description}
          </p>

          <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
            <Link
              href={primaryLink}
              className="btn-primary px-6 py-3.5"
            >
              {primaryText}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={secondaryLink}
              className="inline-flex items-center justify-center gap-2 rounded-button border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
            >
              {secondaryText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
