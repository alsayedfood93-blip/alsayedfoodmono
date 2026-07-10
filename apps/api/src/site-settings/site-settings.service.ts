import { Injectable } from '@nestjs/common';
import type { SiteSettingsDto } from '@alsayed/shared-types';
import type { SiteSettings } from '@alsayed/database';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';

@Injectable()
export class SiteSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async get(): Promise<SiteSettingsDto> {
    const settings = await this.ensureSettings();
    return this.serialize(settings);
  }

  async update(
    dto: UpdateSiteSettingsDto,
    logo?: Express.Multer.File,
  ): Promise<SiteSettingsDto> {
    const existing = await this.ensureSettings();

    let logoPath = existing.logoPath;
    if (logo) {
      logoPath = await this.storage.replaceImage(
        'branding',
        logo,
        existing.logoPath,
      );
    }

    const updated = await this.prisma.siteSettings.update({
      where: { id: existing.id },
      data: {
        companyName: dto.companyName ?? existing.companyName,
        email: dto.email === undefined ? existing.email : dto.email,
        phone: dto.phone === undefined ? existing.phone : dto.phone,
        whatsapp: dto.whatsapp === undefined ? existing.whatsapp : dto.whatsapp,
        address: dto.address === undefined ? existing.address : dto.address,
        facebookUrl:
          dto.facebookUrl === undefined
            ? existing.facebookUrl
            : dto.facebookUrl,
        instagramUrl:
          dto.instagramUrl === undefined
            ? existing.instagramUrl
            : dto.instagramUrl,
        tiktokUrl:
          dto.tiktokUrl === undefined ? existing.tiktokUrl : dto.tiktokUrl,
        logoPath,
      },
    });
    return this.serialize(updated);
  }

  private async ensureSettings(): Promise<SiteSettings> {
    const existing = await this.prisma.siteSettings.findFirst({
      orderBy: { id: 'asc' },
    });
    if (existing) {
      return existing;
    }
    return this.prisma.siteSettings.create({
      data: { companyName: 'ALSAYED Food & Beverages' },
    });
  }

  private serialize(settings: SiteSettings): SiteSettingsDto {
    return {
      id: settings.id,
      companyName: settings.companyName,
      email: settings.email,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      address: settings.address,
      facebookUrl: settings.facebookUrl,
      instagramUrl: settings.instagramUrl,
      tiktokUrl: settings.tiktokUrl,
      logoPath: settings.logoPath,
      createdAt: settings.createdAt.toISOString(),
      updatedAt: settings.updatedAt.toISOString(),
    };
  }
}
