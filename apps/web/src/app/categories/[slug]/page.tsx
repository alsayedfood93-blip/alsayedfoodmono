import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategoryProducts } from "@/lib/api";
import { ProductCard } from "@/components/ui/product-card";
import { Eyebrow } from "@/components/ui/section-heading";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return { title: "Category not found" };
  }
  return {
    title: category.title,
    description:
      category.description ?? `Explore ALSAYED ${category.title} beverages.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getCategoryProducts(slug),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <nav className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">
          Products
        </Link>
        <span>/</span>
        <span className="text-ink">{category.title}</span>
      </nav>

      <div className="mt-6">
        <Eyebrow>Category</Eyebrow>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
          {category.title}
        </h1>
        {category.description && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            {category.description}
          </p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="mt-16 rounded-card border border-dashed border-border bg-card p-12 text-center shadow-premium">
          <p className="font-serif text-xl font-bold text-ink">
            No products in this category yet
          </p>
          <p className="mt-2 text-sm text-muted">Please check back soon.</p>
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
