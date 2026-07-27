import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/api";
import { resolveImageUrl } from "@/lib/config";
import { ProductImage } from "@/components/ui/product-image";
import { ArrowRight, WhatsAppIcon } from "@/components/brand/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }
  const image = resolveImageUrl(product.imagePath);
  return {
    title: product.title,
    description:
      product.description ?? `${product.title} — an ALSAYED beverage.`,
    openGraph: {
      title: product.title,
      description: product.description ?? undefined,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-16">
      <nav className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">
          Products
        </Link>
        <span>/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex items-center justify-center rounded-card border border-border bg-gradient-to-b from-soft to-card p-10 shadow-premium">
          <ProductImage
            imagePath={product.imagePath}
            alt={product.title}
            seed={product.id}
            className="flex h-72 items-end lg:h-96"
          />
        </div>

        <div className="flex flex-col justify-center">
          {product.category && (
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-sm font-semibold uppercase tracking-wide text-primary"
            >
              {product.category.title}
            </Link>
          )}
          <h1 className="mt-2 font-serif text-4xl font-bold leading-tight text-ink">
            {product.title}
          </h1>
          {product.size && (
            <p className="mt-2 text-lg text-muted">{product.size}</p>
          )}
          {product.description && (
            <p className="mt-5 text-base leading-relaxed text-ink-soft">
              {product.description}
            </p>
          )}

          {product.ingredients.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">
                Ingredients
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="rounded-badge border border-border bg-card px-3 py-1 text-sm text-ink-soft"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#contact"
              className="btn-primary px-6 py-3.5"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Enquire to Order
            </Link>
            <Link
              href="/products"
              className="btn-secondary px-6 py-3.5"
            >
              Back to Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
