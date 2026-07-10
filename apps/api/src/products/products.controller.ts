import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { QueryProductsDto } from './dto/query-products.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List active products with optional filters' })
  findAll(@Query() query: QueryProductsDto) {
    return this.productsService.findAllPublic(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get an active product by slug' })
  findOne(@Param('slug') slug: string) {
    return this.productsService.findBySlugPublic(slug);
  }
}
