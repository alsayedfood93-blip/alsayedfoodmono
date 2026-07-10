import Link from "next/link";
import type { HeroContentDto, ProductDto } from "@alsayed/shared-types";
import { ArrowRight, LeafIcon } from "@/components/brand/icons";
import { ProductImage } from "@/components/ui/product-image";

export function Hero({
  hero,
  products,
}: {
  hero: HeroContentDto | null;
  products: ProductDto[];
}) {
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

  const lineup = products.slice(0, 6);

  return (
    <section className="relative overflow-hidden">
      {/* Soft landscape wash at the base of the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-100/70 via-brand-50/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 pb-4 pt-10 md:pt-16 lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-8 lg:pb-10">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
            <LeafIcon className="h-3.5 w-3.5" />
            {eyebrow}
          </span>

          <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            {title}
            <br />
            <span className="text-brand-600">{highlight}</span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
            {description}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={primaryLink}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              {primaryText}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={secondaryLink}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              {secondaryText}
            </Link>
          </div>
        </div>

        {/* Product lineup */}
        <div className="animate-fade-up">
          <div className="relative">
            <div className="flex items-end justify-center gap-1.5 sm:gap-3">
              {lineup.map((product, i) => (
                <ProductImage
                  key={product.id}
                  imagePath={product.imagePath}
                  alt={product.title}
                  seed={i}
                  className="flex h-40 items-end sm:h-56 lg:h-72"
                  imgClassName={
                    i % 2 === 0
                      ? "drop-shadow-xl"
                      : "translate-y-1 drop-shadow-xl"
                  }
                />
              ))}
            </div>
            {/* Ice / reflection base */}
            <div
              aria-hidden="true"
              className="mx-auto mt-[-8px] h-6 w-[92%] rounded-full bg-gradient-to-r from-transparent via-brand-200/60 to-transparent blur-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
