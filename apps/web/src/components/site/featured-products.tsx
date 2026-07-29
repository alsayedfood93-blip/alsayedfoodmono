import Link from "next/link";
import type { ProductDto } from "@alsayed/shared-types";
import { ArrowRight } from "@/components/brand/icons";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/ui/product-card";
import { ProductImage } from "@/components/ui/product-image";
import { GlassSection } from "@/components/background";

export function FeaturedProducts({ products }: { products: ProductDto[] }) {
  if (products.length === 0) {
    return null;
  }
  const visibleProducts = products.slice(0, 4);

  return (
    <GlassSection
      id="featured"
      tone="clear"
      blend="both"
      panelClassName="px-5 py-8 md:px-8 md:py-10"
    >
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <Eyebrow>Our Signature Drinks</Eyebrow>
          <SectionHeading className="mt-2 text-3xl sm:text-4xl">
            Handpicked for You
          </SectionHeading>
        </div>
        <Link
          href="/products"
          className="group inline-flex items-center gap-2 pb-1 text-sm font-semibold text-primary transition-colors duration-300 hover:text-primary-dark"
        >
          View all products
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-2 no-scrollbar sm:hidden">
        {visibleProducts.map((product, i) => (
          <div
            key={product.id}
            className="w-[78vw] max-w-[275px] flex-none snap-start"
          >
            <ProductCard product={product} seed={i} featuredLayout />
          </div>
        ))}
        <div className="w-[78vw] max-w-[275px] flex-none snap-start">
          <ExploreAllCard />
        </div>
      </div>
      <div className="mt-8 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {visibleProducts.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            seed={i}
            featuredLayout
          />
        ))}
        <ExploreAllCard />
      </div>
    </GlassSection>
  );
}

function ExploreAllCard() {
  return (
    <Link
      href="/products"
      className="group flex min-h-[390px] flex-col overflow-hidden rounded-[18px] border border-white/55 bg-white/15 shadow-[0_14px_36px_rgba(15,106,75,0.10),inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/80 hover:shadow-[0_20px_45px_rgba(15,106,75,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]"
    >
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_75%,rgba(255,255,255,0.95)_0%,rgba(223,245,255,0.65)_50%,rgba(79,209,165,0.15)_100%)]">
        <ProductImage
          imagePath={null}
          alt=""
          placeholder="image"
          className="flex h-40 items-center justify-center"
        />
      </div>

      <div className="relative flex flex-1 flex-col border-t border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.38),rgba(255,255,255,0.12))] p-4 backdrop-blur-2xl">
        <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary">
          Complete Collection
        </span>
        <h3 className="mt-1.5 font-serif text-base leading-snug font-bold text-ink">
          Explore All Drinks
        </h3>
        <p className="mt-3 text-xs leading-relaxed text-ink-soft">
          View our complete range of premium beverages.
        </p>
        <span className="mt-auto ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-primary/35 text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
