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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_16px_40px_-24px_rgba(19,32,26,0.4)]"
    >
      <div className="relative flex items-center justify-center bg-gradient-to-b from-brand-50 to-white p-6">
        {product.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white">
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
          <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
            {product.category.title}
          </span>
        )}
        <h3 className="mt-1 font-serif text-lg font-semibold text-ink">
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
