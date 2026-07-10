import type { ProductDto } from '@alsayed/shared-types';
import type { Category, Product } from '@alsayed/database';

export function serializeProduct(
  product: Product & { category?: Category | null },
): ProductDto {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    size: product.size,
    price: product.price,
    ingredients: product.ingredients,
    imagePath: product.imagePath,
    categoryId: product.categoryId,
    category: product.category
      ? {
          id: product.category.id,
          title: product.category.title,
          slug: product.category.slug,
        }
      : undefined,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    sortOrder: product.sortOrder,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}
