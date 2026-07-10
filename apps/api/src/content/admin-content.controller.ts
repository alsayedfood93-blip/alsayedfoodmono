import {
  Body,
  Controller,
  Patch,
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
import { ContentService } from './content.service';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { UpdateCeoDto } from './dto/update-ceo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImageUploadInterceptor } from '../storage/image-upload.interceptor';

@ApiTags('admin/content')
@ApiBearerAuth('admin-access')
@UseGuards(JwtAuthGuard)
@Controller('admin/content')
export class AdminContentController {
  constructor(private readonly contentService: ContentService) {}

  @Patch('hero')
  @ApiOperation({ summary: 'Update hero content' })
  updateHero(@Body() dto: UpdateHeroDto) {
    return this.contentService.updateHero(dto);
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
