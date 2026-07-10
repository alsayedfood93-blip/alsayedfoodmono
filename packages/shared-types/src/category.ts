export interface CategoryDto {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  imagePath: string | null;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}
