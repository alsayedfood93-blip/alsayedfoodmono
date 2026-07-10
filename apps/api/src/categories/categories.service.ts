import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CategoryDto, ProductDto } from '@alsayed/shared-types';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { resolveUniqueSlug } from '../common/utils/slug.util';
import { serializeCategory } from './category.serializer';
import { serializeProduct } from '../products/product.serializer';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async findAllPublic(): Promise<CategoryDto[]> {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });
    return categories.map(serializeCategory);
  }

  async findBySlugPublic(slug: string): Promise<CategoryDto> {
    const category = await this.prisma.category.findFirst({
      where: { slug, isActive: true },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found.');
    }
    return serializeCategory(category);
  }

  async findProductsByCategorySlug(slug: string): Promise<ProductDto[]> {
    const category = await this.prisma.category.findFirst({
      where: { slug, isActive: true },
      select: { id: true },
    });
    if (!category) {
      throw new NotFoundException('Category not found.');
    }
    const products = await this.prisma.product.findMany({
      where: { categoryId: category.id, isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
      include: { category: true },
    });
    return products.map(serializeProduct);
  }

  async findAllAdmin(): Promise<CategoryDto[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
      include: { _count: { select: { products: true } } },
    });
    return categories.map(serializeCategory);
  }

  async findOneAdmin(id: number): Promise<CategoryDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!category) {
      throw new NotFoundException('Category not found.');
    }
    return serializeCategory(category);
  }

  async create(
    dto: CreateCategoryDto,
    image?: Express.Multer.File,
  ): Promise<CategoryDto> {
    const slug = await resolveUniqueSlug(dto.slug || dto.title, (candidate) =>
      this.slugExists(candidate),
    );

    const imagePath = image
      ? await this.storage.saveImage('categories', image)
      : null;

    const category = await this.prisma.category.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description ?? null,
        imagePath,
        isActive: dto.isActive ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
      include: { _count: { select: { products: true } } },
    });
    return serializeCategory(category);
  }

  async update(
    id: number,
    dto: UpdateCategoryDto,
    image?: Express.Multer.File,
  ): Promise<CategoryDto> {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Category not found.');
    }

    let slug = existing.slug;
    if (dto.slug && dto.slug !== existing.slug) {
      slug = await resolveUniqueSlug(dto.slug, (candidate) =>
        this.slugExists(candidate, id),
      );
    }

    let imagePath = existing.imagePath;
    if (image) {
      imagePath = await this.storage.replaceImage(
        'categories',
        image,
        existing.imagePath,
      );
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        slug,
        description:
          dto.description === undefined
            ? existing.description
            : dto.description,
        imagePath,
        isActive: dto.isActive ?? existing.isActive,
        sortOrder: dto.sortOrder ?? existing.sortOrder,
      },
      include: { _count: { select: { products: true } } },
    });
    return serializeCategory(category);
  }

  async remove(id: number): Promise<{ success: true }> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!category) {
      throw new NotFoundException('Category not found.');
    }
    if (category._count.products > 0) {
      throw new ConflictException(
        `Cannot delete category "${category.title}" because it still has ${category._count.products} product(s). Move or delete those products first.`,
      );
    }

    await this.prisma.category.delete({ where: { id } });
    if (category.imagePath) {
      await this.storage.deleteByPublicPath(category.imagePath);
    }
    return { success: true };
  }

  private async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const found = await this.prisma.category.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!found) {
      return false;
    }
    return excludeId ? found.id !== excludeId : true;
  }
}
