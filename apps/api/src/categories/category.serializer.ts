import type { CategoryDto } from '@alsayed/shared-types';
import type { Category } from '@alsayed/database';

export function serializeCategory(
  category: Category & { _count?: { products: number } },
): CategoryDto {
  return {
    id: category.id,
    title: category.title,
    slug: category.slug,
    description: category.description,
    imagePath: category.imagePath,
    isActive: category.isActive,
    sortOrder: category.sortOrder,
    productCount: category._count?.products,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}
