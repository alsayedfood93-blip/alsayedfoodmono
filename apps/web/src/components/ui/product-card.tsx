import Link from "next/link";
import type { ProductDto } from "@alsayed/shared-types";
import { ArrowRight } from "@/components/brand/icons";
import { ProductImage } from "./product-image";

export function ProductCard({
  product,
  seed = 0,
  featuredLayout = false,
}: {
  product: ProductDto;
  seed?: number;
  featuredLayout?: boolean;
}) {
  if (featuredLayout) {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group flex h-full min-h-[390px] flex-col overflow-hidden rounded-[18px] border border-white/55 bg-white/15 shadow-[0_14px_36px_rgba(15,106,75,0.10),inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/80 hover:shadow-[0_20px_45px_rgba(15,106,75,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]"
      >
        <div className="relative flex h-48 items-end justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_70%,rgba(255,255,255,0.95)_0%,rgba(223,245,255,0.65)_45%,rgba(191,231,250,0.35)_100%)] px-5 pt-8">
          <span className="absolute top-3 left-3 z-10 rounded-full bg-primary px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white shadow-sm">
            Featured
          </span>
          <span className="absolute right-4 bottom-5 left-4 h-10 rounded-[50%] bg-primary/8 blur-xl transition-transform duration-500 group-hover:scale-110" />
          <ProductImage
            imagePath={product.imagePath}
            alt={product.title}
            seed={seed}
            className="absolute inset-0 h-full w-full"
            imgClassName="transition-transform duration-500 group-hover:scale-105"
            placeholder="image"
            fit="cover"
          />
        </div>

        <div className="relative flex flex-1 flex-col border-t border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.38),rgba(255,255,255,0.12))] p-4 backdrop-blur-2xl">
          <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
          {product.category && (
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary">
              {product.category.title}
            </span>
          )}
          <h3 className="mt-1.5 font-serif text-base leading-snug font-bold text-ink">
            {product.title}
          </h3>
          {product.size && (
            <p className="mt-1 text-xs font-medium text-muted">{product.size}</p>
          )}
          {product.description && (
            <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-soft">
              {product.description}
            </p>
          )}

          <div className="mt-auto flex items-center justify-end pt-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/35 text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-card shadow-premium transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-mint/40 hover:shadow-premium-hover"
    >
      <div className="relative flex items-center justify-center bg-gradient-to-b from-soft to-card p-6">
        {product.isFeatured && (
          <span className="absolute left-3 top-3 rounded-badge border border-white/30 bg-white/70 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-primary backdrop-blur-md">
            Featured
          </span>
        )}
        <ProductImage
          imagePath={product.imagePath}
          alt={product.title}
          seed={seed}
          className="flex h-40 items-end"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {product.category && (
          <span className="text-xs font-medium uppercase tracking-wide text-primary">
            {product.category.title}
          </span>
        )}
        <h3 className="mt-1 font-serif text-lg font-bold text-ink">
          {product.title}
        </h3>
        {product.size && (
          <p className="mt-0.5 text-sm text-muted">{product.size}</p>
        )}
        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {product.description}
          </p>
        )}
      </div>
    </Link>
  );
}
