import Link from "next/link";
import type { ProductDto } from "@alsayed/shared-types";
import { ProductImage } from "./product-image";

export function ProductCard({
  product,
  seed = 0,
}: {
  product: ProductDto;
  seed?: number;
}) {
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
