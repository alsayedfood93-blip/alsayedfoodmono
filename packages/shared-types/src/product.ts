export interface ProductCategorySummary {
  id: number;
  title: string;
  slug: string;
}

export interface ProductDto {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  size: string | null;
  price: number | null;
  ingredients: string[];
  imagePath: string | null;
  categoryId: number;
  category?: ProductCategorySummary;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
