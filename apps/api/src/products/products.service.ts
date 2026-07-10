import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@alsayed/database';
import type { ProductDto } from '@alsayed/shared-types';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { resolveUniqueSlug } from '../common/utils/slug.util';
import { serializeProduct } from './product.serializer';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async findAllPublic(query: QueryProductsDto): Promise<ProductDto[]> {
    const where: Prisma.ProductWhereInput = { isActive: true };

    if (query.category) {
      where.category = { slug: query.category, isActive: true };
    }
    if (query.featured !== undefined) {
      where.isFeatured = query.featured;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const products = await this.prisma.product.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
      include: { category: true },
    });
    return products.map(serializeProduct);
  }

  async findBySlugPublic(slug: string): Promise<ProductDto> {
    const product = await this.prisma.product.findFirst({
      where: { slug, isActive: true },
      include: { category: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    return serializeProduct(product);
  }

  async findAllAdmin(): Promise<ProductDto[]> {
    const products = await this.prisma.product.findMany({
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
      include: { category: true },
    });
    return products.map(serializeProduct);
  }

  async findOneAdmin(id: number): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    return serializeProduct(product);
  }

  async create(
    dto: CreateProductDto,
    image?: Express.Multer.File,
  ): Promise<ProductDto> {
    await this.assertCategoryExists(dto.categoryId);

    const slug = await resolveUniqueSlug(dto.slug || dto.title, (candidate) =>
      this.slugExists(candidate),
    );
    const imagePath = image
      ? await this.storage.saveImage('products', image)
      : null;

    const product = await this.prisma.product.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description ?? null,
        size: dto.size ?? null,
        price: dto.price ?? null,
        ingredients: dto.ingredients ?? [],
        imagePath,
        categoryId: dto.categoryId,
        isActive: dto.isActive ?? true,
        isFeatured: dto.isFeatured ?? false,
        sortOrder: dto.sortOrder ?? 0,
      },
      include: { category: true },
    });
    return serializeProduct(product);
  }

  async update(
    id: number,
    dto: UpdateProductDto,
    image?: Express.Multer.File,
  ): Promise<ProductDto> {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Product not found.');
    }
    if (dto.categoryId && dto.categoryId !== existing.categoryId) {
      await this.assertCategoryExists(dto.categoryId);
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
        'products',
        image,
        existing.imagePath,
      );
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        slug,
        description:
          dto.description === undefined
            ? existing.description
            : dto.description,
        size: dto.size === undefined ? existing.size : dto.size,
        price: dto.price === undefined ? existing.price : dto.price,
        ingredients: dto.ingredients ?? existing.ingredients,
        imagePath,
        categoryId: dto.categoryId ?? existing.categoryId,
        isActive: dto.isActive ?? existing.isActive,
        isFeatured: dto.isFeatured ?? existing.isFeatured,
        sortOrder: dto.sortOrder ?? existing.sortOrder,
      },
      include: { category: true },
    });
    return serializeProduct(product);
  }

  async remove(id: number): Promise<{ success: true }> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    await this.prisma.product.delete({ where: { id } });
    if (product.imagePath) {
      await this.storage.deleteByPublicPath(product.imagePath);
    }
    return { success: true };
  }

  private async assertCategoryExists(categoryId: number): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    if (!category) {
      throw new BadRequestException(`Category ${categoryId} does not exist.`);
    }
  }

  private async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const found = await this.prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!found) {
      return false;
    }
    return excludeId ? found.id !== excludeId : true;
  }
}
