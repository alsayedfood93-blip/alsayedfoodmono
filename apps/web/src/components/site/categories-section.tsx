import Link from "next/link";
import type { CategoryDto } from "@alsayed/shared-types";
import { ArrowRight } from "@/components/brand/icons";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { CategoryCard } from "@/components/ui/category-card";

export function CategoriesSection({
  categories,
}: {
  categories: CategoryDto[];
}) {
  return (
    <section id="categories" className="scroll-mt-24 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Our Categories</Eyebrow>
            <SectionHeading className="mt-3">
              Explore Our
              <br className="hidden sm:block" /> Beverages
            </SectionHeading>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            View all categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {categories.length === 0 ? (
          <p className="mt-10 text-muted">No categories available yet.</p>
        ) : (
          <>
            {/* Mobile: horizontal scroller. Desktop: grid. */}
            <div className="mt-10 flex snap-x gap-4 overflow-x-auto pb-2 no-scrollbar sm:hidden">
              {categories.map((category, i) => (
                <div key={category.id} className="w-56 flex-none snap-start">
                  <CategoryCard category={category} seed={i} />
                </div>
              ))}
            </div>
            <div className="mt-10 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category, i) => (
                <CategoryCard key={category.id} category={category} seed={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
