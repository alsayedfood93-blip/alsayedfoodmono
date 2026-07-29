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
    <section
      id="categories"
      className="scroll-mt-24 border-b border-primary/10 bg-background"
    >
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-18">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Eyebrow>Explore Our Categories</Eyebrow>
            <SectionHeading className="mt-2 text-3xl sm:text-4xl">
              Beverages for Every Moment
            </SectionHeading>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 pb-1 text-sm font-semibold text-primary transition-colors duration-300 hover:text-primary-dark"
          >
            View all categories
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="mt-8 rounded-[18px] border border-dashed border-primary/25 bg-white/30 px-6 py-12 text-center text-sm text-muted">
            No categories available yet.
          </div>
        ) : (
          <>
            {/* Mobile: horizontal scroller. Desktop: grid. */}
            <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-2 no-scrollbar sm:hidden">
              {categories.map((category, i) => (
                <div key={category.id} className="w-[78vw] max-w-[290px] flex-none snap-start">
                  <CategoryCard category={category} seed={i} />
                </div>
              ))}
            </div>
            <div className="mt-8 hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
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
