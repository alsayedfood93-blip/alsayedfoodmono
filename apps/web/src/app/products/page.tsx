import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts, getCategories } from "@/lib/api";
import { ProductCard } from "@/components/ui/product-card";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse the full range of ALSAYED premium beverages — mineral water, fizzy drinks, energy drinks and cola.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getAllProducts({ category: params.category, search: params.search }),
    getCategories(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <Eyebrow>Our Range</Eyebrow>
      <SectionHeading className="mt-3">All Beverages</SectionHeading>
      <p className="mt-4 max-w-lg text-ink-soft">
        Explore our full lineup of premium drinks, crafted with care.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <FilterChip label="All" href="/products" active={!params.category} />
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            label={c.title}
            href={`/products?category=${c.slug}`}
            active={params.category === c.slug}
          />
        ))}
      </div>

      {products.length === 0 ? (
        <div className="mt-16 rounded-card border border-dashed border-border bg-card p-12 text-center shadow-premium">
          <p className="font-serif text-xl font-bold text-ink">No products found</p>
          <p className="mt-2 text-sm text-muted">
            Try a different category or check back soon.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} seed={i} />
          ))}
        </div>
      )}
    </main>
  );
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-badge border px-4 py-2 text-sm font-medium transition-all duration-300 ${
        active
          ? "border-primary bg-primary text-white shadow-premium"
          : "border-border bg-card text-ink-soft hover:border-mint hover:bg-soft hover:text-primary"
      }`}
    >
      {label}
    </Link>
  );
}
