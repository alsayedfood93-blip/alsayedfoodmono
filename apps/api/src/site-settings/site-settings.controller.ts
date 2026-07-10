import {
  Body,
  Controller,
  Get,
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
import { SiteSettingsService } from './site-settings.service';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImageUploadInterceptor } from '../storage/image-upload.interceptor';

@ApiTags('site-settings')
@Controller()
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get('site-settings')
  @ApiOperation({ summary: 'Get public site settings' })
  get() {
    return this.siteSettingsService.get();
  }

  @Patch('admin/site-settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('admin-access')
  @UseInterceptors(ImageUploadInterceptor('logo'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Update site settings (with optional logo)' })
  update(
    @Body() dto: UpdateSiteSettingsDto,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    return this.siteSettingsService.update(dto, logo);
  }
}
