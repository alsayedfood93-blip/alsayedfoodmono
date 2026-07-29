import Link from "next/link";
import type { CategoryDto } from "@alsayed/shared-types";
import { ArrowRight } from "@/components/brand/icons";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { CategoryCard } from "@/components/ui/category-card";
import { GlassSection } from "@/components/background";

export function CategoriesSection({
  categories,
}: {
  categories: CategoryDto[];
}) {
  return (
    <GlassSection
      id="categories"
      tone="clear"
      blend="both"
      panelClassName="px-5 py-8 md:px-8 md:py-10"
    >
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
        <div className="mt-8 rounded-[18px] border border-dashed border-primary/25 bg-white/35 px-6 py-12 text-center text-sm text-muted backdrop-blur-md">
          No categories available yet.
        </div>
      ) : (
        <>
          {/* Mobile: vertical list. Desktop: grid. */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:hidden">
            {categories.map((category, i) => (
              <div key={category.id} className="w-full">
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
    </GlassSection>
  );
}
