import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImageUploadInterceptor } from '../storage/image-upload.interceptor';

@ApiTags('admin/products')
@ApiBearerAuth('admin-access')
@UseGuards(JwtAuthGuard)
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List all products (admin)' })
  findAll() {
    return this.productsService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id (admin)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOneAdmin(id);
  }

  @Post()
  @UseInterceptors(ImageUploadInterceptor('image'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Create a product' })
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.productsService.create(dto, image);
  }

  @Patch(':id')
  @UseInterceptors(ImageUploadInterceptor('image'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Update a product' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.productsService.update(id, dto, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
