import Link from "next/link";
import type { ProductDto } from "@alsayed/shared-types";
import { ArrowRight } from "@/components/brand/icons";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/ui/product-card";

export function FeaturedProducts({ products }: { products: ProductDto[] }) {
  if (products.length === 0) {
    return null;
  }
  return (
    <section id="featured" className="scroll-mt-24 border-t border-ink/10 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Featured Selection</Eyebrow>
            <SectionHeading className="mt-3">Our Signature Drinks</SectionHeading>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 flex snap-x gap-4 overflow-x-auto pb-2 no-scrollbar sm:hidden">
          {products.map((product, i) => (
            <div key={product.id} className="w-60 flex-none snap-start">
              <ProductCard product={product} seed={i} />
            </div>
          ))}
        </div>
        <div className="mt-10 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} seed={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
