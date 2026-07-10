import { Injectable } from '@nestjs/common';
import type { CeoMessageDto, HeroContentDto } from '@alsayed/shared-types';
import type { CeoMessage, HeroContent } from '@alsayed/database';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { UpdateCeoDto } from './dto/update-ceo.dto';

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async getHero(): Promise<HeroContentDto | null> {
    const hero = await this.prisma.heroContent.findFirst({
      orderBy: { id: 'asc' },
    });
    return hero ? this.serializeHero(hero) : null;
  }

  async updateHero(dto: UpdateHeroDto): Promise<HeroContentDto> {
    const existing = await this.prisma.heroContent.findFirst({
      orderBy: { id: 'asc' },
    });

    if (!existing) {
      const created = await this.prisma.heroContent.create({
        data: {
          eyebrow: dto.eyebrow ?? null,
          title: dto.title ?? 'ALSAYED',
          highlightedText: dto.highlightedText ?? null,
          description: dto.description ?? null,
          primaryButtonText: dto.primaryButtonText ?? null,
          primaryButtonLink: dto.primaryButtonLink ?? null,
          secondaryButtonText: dto.secondaryButtonText ?? null,
          secondaryButtonLink: dto.secondaryButtonLink ?? null,
          isActive: dto.isActive ?? true,
        },
      });
      return this.serializeHero(created);
    }

    const updated = await this.prisma.heroContent.update({
      where: { id: existing.id },
      data: {
        eyebrow: dto.eyebrow === undefined ? existing.eyebrow : dto.eyebrow,
        title: dto.title ?? existing.title,
        highlightedText:
          dto.highlightedText === undefined
            ? existing.highlightedText
            : dto.highlightedText,
        description:
          dto.description === undefined
            ? existing.description
            : dto.description,
        primaryButtonText:
          dto.primaryButtonText === undefined
            ? existing.primaryButtonText
            : dto.primaryButtonText,
        primaryButtonLink:
          dto.primaryButtonLink === undefined
            ? existing.primaryButtonLink
            : dto.primaryButtonLink,
        secondaryButtonText:
          dto.secondaryButtonText === undefined
            ? existing.secondaryButtonText
            : dto.secondaryButtonText,
        secondaryButtonLink:
          dto.secondaryButtonLink === undefined
            ? existing.secondaryButtonLink
            : dto.secondaryButtonLink,
        isActive: dto.isActive ?? existing.isActive,
      },
    });
    return this.serializeHero(updated);
  }

  async getCeo(): Promise<CeoMessageDto | null> {
    const ceo = await this.prisma.ceoMessage.findFirst({
      orderBy: { id: 'asc' },
    });
    return ceo ? this.serializeCeo(ceo) : null;
  }

  async updateCeo(
    dto: UpdateCeoDto,
    image?: Express.Multer.File,
  ): Promise<CeoMessageDto> {
    const existing = await this.prisma.ceoMessage.findFirst({
      orderBy: { id: 'asc' },
    });

    if (!existing) {
      const imagePath = image
        ? await this.storage.saveImage('ceo', image)
        : null;
      const created = await this.prisma.ceoMessage.create({
        data: {
          name: dto.name ?? 'ALSAYED CEO',
          title: dto.title ?? 'Founder & CEO',
          description: dto.description ?? '',
          imagePath,
          isActive: dto.isActive ?? true,
        },
      });
      return this.serializeCeo(created);
    }

    let imagePath = existing.imagePath;
    if (image) {
      imagePath = await this.storage.replaceImage(
        'ceo',
        image,
        existing.imagePath,
      );
    }

    const updated = await this.prisma.ceoMessage.update({
      where: { id: existing.id },
      data: {
        name: dto.name ?? existing.name,
        title: dto.title ?? existing.title,
        description: dto.description ?? existing.description,
        imagePath,
        isActive: dto.isActive ?? existing.isActive,
      },
    });
    return this.serializeCeo(updated);
  }

  private serializeHero(hero: HeroContent): HeroContentDto {
    return {
      id: hero.id,
      eyebrow: hero.eyebrow,
      title: hero.title,
      highlightedText: hero.highlightedText,
      description: hero.description,
      primaryButtonText: hero.primaryButtonText,
      primaryButtonLink: hero.primaryButtonLink,
      secondaryButtonText: hero.secondaryButtonText,
      secondaryButtonLink: hero.secondaryButtonLink,
      isActive: hero.isActive,
      createdAt: hero.createdAt.toISOString(),
      updatedAt: hero.updatedAt.toISOString(),
    };
  }

  private serializeCeo(ceo: CeoMessage): CeoMessageDto {
    return {
      id: ceo.id,
      name: ceo.name,
      title: ceo.title,
      description: ceo.description,
      imagePath: ceo.imagePath,
      isActive: ceo.isActive,
      createdAt: ceo.createdAt.toISOString(),
      updatedAt: ceo.updatedAt.toISOString(),
    };
  }
}
