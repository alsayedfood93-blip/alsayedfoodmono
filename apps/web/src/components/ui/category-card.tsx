import Link from "next/link";
import type { CategoryDto } from "@alsayed/shared-types";
import { ArrowRight } from "@/components/brand/icons";
import { ProductImage } from "./product-image";

export function CategoryCard({
  category,
  seed = 0,
}: {
  category: CategoryDto;
  seed?: number;
}) {
  const count = category.productCount ?? 0;
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-card shadow-premium transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-mint/40 hover:shadow-premium-hover"
    >
      <div className="flex items-center justify-center bg-gradient-to-b from-soft to-card p-6">
        <ProductImage
          imagePath={category.imagePath}
          alt={category.title}
          seed={seed}
          className="flex h-32 items-end"
        />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border/60 p-5">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-lg font-bold text-ink">
            {category.title}
          </h3>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-muted">
            {count.toString().padStart(2, "0")} Product{count === 1 ? "" : "s"}
          </p>
        </div>
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-button border border-border text-primary transition-all duration-300 group-hover:border-transparent group-hover:bg-primary group-hover:text-white">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
