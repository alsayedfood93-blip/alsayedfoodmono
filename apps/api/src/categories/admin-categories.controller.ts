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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImageUploadInterceptor } from '../storage/image-upload.interceptor';

@ApiTags('admin/categories')
@ApiBearerAuth('admin-access')
@UseGuards(JwtAuthGuard)
@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all categories (admin)' })
  findAll() {
    return this.categoriesService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id (admin)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOneAdmin(id);
  }

  @Post()
  @UseInterceptors(ImageUploadInterceptor('image'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Create a category' })
  create(
    @Body() dto: CreateCategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.categoriesService.create(dto, image);
  }

  @Patch(':id')
  @UseInterceptors(ImageUploadInterceptor('image'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Update a category' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.categoriesService.update(id, dto, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category (rejected if it has products)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
