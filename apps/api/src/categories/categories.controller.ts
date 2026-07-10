import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List active categories' })
  findAll() {
    return this.categoriesService.findAllPublic();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get an active category by slug' })
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findBySlugPublic(slug);
  }

  @Get(':slug/products')
  @ApiOperation({ summary: 'List active products in a category' })
  findProducts(@Param('slug') slug: string) {
    return this.categoriesService.findProductsByCategorySlug(slug);
  }
}
