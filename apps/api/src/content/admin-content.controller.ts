import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ContentService } from './content.service';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { UpdateCeoDto } from './dto/update-ceo.dto';
import { ReorderHeroImagesDto } from './dto/reorder-hero-images.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImageUploadInterceptor } from '../storage/image-upload.interceptor';
import { ImagesUploadInterceptor } from '../storage/images-upload.interceptor';

@ApiTags('admin/content')
@ApiBearerAuth('admin-access')
@UseGuards(JwtAuthGuard)
@Controller('admin/content')
export class AdminContentController {
  constructor(private readonly contentService: ContentService) {}

  @Patch('hero')
  @UseInterceptors(ImagesUploadInterceptor('images', 10))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary:
      'Update hero content and optionally upload, delete, or reorder background images',
  })
  @ApiBody({ type: UpdateHeroDto })
  updateHero(
    @Body() dto: UpdateHeroDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    return this.contentService.updateHero(dto, images ?? []);
  }

  @Post('hero/images')
  @UseInterceptors(ImagesUploadInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload one or more hero background images' })
  uploadHeroImages(@UploadedFiles() images?: Express.Multer.File[]) {
    return this.contentService.addHeroImages(images ?? []);
  }

  @Delete('hero/images/:id')
  @ApiOperation({ summary: 'Delete a hero background image' })
  deleteHeroImage(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.deleteHeroImage(id);
  }

  @Patch('hero/images/reorder')
  @ApiOperation({ summary: 'Reorder hero background images' })
  reorderHeroImages(@Body() dto: ReorderHeroImagesDto) {
    return this.contentService.reorderHeroImages(dto.orderedIds);
  }

  @Patch('ceo')
  @UseInterceptors(ImageUploadInterceptor('image'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Update CEO message (with optional image)' })
  updateCeo(
    @Body() dto: UpdateCeoDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.contentService.updateCeo(dto, image);
  }
}
