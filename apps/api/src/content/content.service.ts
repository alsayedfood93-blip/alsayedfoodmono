import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CeoMessageDto,
  HeroContentDto,
  HeroImageDto,
} from '@alsayed/shared-types';
import type { CeoMessage, HeroContent, HeroImage } from '@alsayed/database';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { UpdateCeoDto } from './dto/update-ceo.dto';

type HeroWithImages = HeroContent & { images: HeroImage[] };

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async getHero(): Promise<HeroContentDto | null> {
    const hero = await this.findHeroWithImages();
    return hero ? this.serializeHero(hero) : null;
  }

  async updateHero(
    dto: UpdateHeroDto,
    files: Express.Multer.File[] = [],
  ): Promise<HeroContentDto> {
    const hero = await this.ensureHero(dto);

    if (dto.deleteImageIds?.length) {
      await this.deleteHeroImagesByIds(hero.id, dto.deleteImageIds);
    }

    // Reorder remaining images before appending uploads so imageOrder only
    // needs to reference ids that already exist on the client.
    if (dto.imageOrder?.length) {
      await this.applyImageOrder(hero.id, dto.imageOrder);
    }

    if (files.length > 0) {
      await this.appendHeroImages(hero.id, files);
    }

    const refreshed = await this.findHeroWithImages();
    if (!refreshed) {
      throw new NotFoundException('Hero content was not found after update.');
    }
    return this.serializeHero(refreshed);
  }

  async addHeroImages(files: Express.Multer.File[]): Promise<HeroContentDto> {
    if (!files?.length) {
      throw new BadRequestException('At least one image file is required.');
    }
    const hero = await this.ensureHero({});
    await this.appendHeroImages(hero.id, files);
    const refreshed = await this.findHeroWithImages();
    if (!refreshed) {
      throw new NotFoundException('Hero content was not found after upload.');
    }
    return this.serializeHero(refreshed);
  }

  async deleteHeroImage(imageId: number): Promise<HeroContentDto> {
    const hero = await this.findHeroWithImages();
    if (!hero) {
      throw new NotFoundException('Hero content was not found.');
    }

    const image = hero.images.find((item) => item.id === imageId);
    if (!image) {
      throw new NotFoundException(`Hero image ${imageId} was not found.`);
    }

    await this.prisma.heroImage.delete({ where: { id: imageId } });
    await this.storage.deleteByPublicPath(image.imagePath);

    const refreshed = await this.findHeroWithImages();
    if (!refreshed) {
      throw new NotFoundException('Hero content was not found after delete.');
    }
    return this.serializeHero(refreshed);
  }

  async reorderHeroImages(orderedIds: number[]): Promise<HeroContentDto> {
    const hero = await this.findHeroWithImages();
    if (!hero) {
      throw new NotFoundException('Hero content was not found.');
    }
    await this.applyImageOrder(hero.id, orderedIds);
    const refreshed = await this.findHeroWithImages();
    if (!refreshed) {
      throw new NotFoundException('Hero content was not found after reorder.');
    }
    return this.serializeHero(refreshed);
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

  private async findHeroWithImages(): Promise<HeroWithImages | null> {
    return this.prisma.heroContent.findFirst({
      orderBy: { id: 'asc' },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  private async ensureHero(dto: UpdateHeroDto): Promise<HeroWithImages> {
    const existing = await this.findHeroWithImages();
    if (existing) {
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
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
        },
      });
      return updated;
    }

    return this.prisma.heroContent.create({
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
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  private async appendHeroImages(
    heroId: number,
    files: Express.Multer.File[],
  ): Promise<void> {
    const maxSort = await this.prisma.heroImage.aggregate({
      where: { heroId },
      _max: { sortOrder: true },
    });
    let nextSort = (maxSort._max.sortOrder ?? -1) + 1;

    for (const file of files) {
      const imagePath = await this.storage.saveImage('hero', file);
      await this.prisma.heroImage.create({
        data: {
          heroId,
          imagePath,
          sortOrder: nextSort,
        },
      });
      nextSort += 1;
    }
  }

  private async deleteHeroImagesByIds(
    heroId: number,
    ids: number[],
  ): Promise<void> {
    const images = await this.prisma.heroImage.findMany({
      where: { heroId, id: { in: ids } },
    });
    if (images.length === 0) {
      return;
    }

    await this.prisma.heroImage.deleteMany({
      where: { heroId, id: { in: images.map((image) => image.id) } },
    });

    await Promise.all(
      images.map((image) => this.storage.deleteByPublicPath(image.imagePath)),
    );
  }

  private async applyImageOrder(
    heroId: number,
    orderedIds: number[],
  ): Promise<void> {
    const existing = await this.prisma.heroImage.findMany({
      where: { heroId },
      select: { id: true },
    });
    const existingIds = new Set(existing.map((image) => image.id));
    const uniqueOrdered = orderedIds.filter(
      (id, index) => orderedIds.indexOf(id) === index && existingIds.has(id),
    );

    if (uniqueOrdered.length !== existingIds.size) {
      throw new BadRequestException(
        'imageOrder must include every current hero background image exactly once.',
      );
    }

    await this.prisma.$transaction(
      uniqueOrdered.map((id, index) =>
        this.prisma.heroImage.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );
  }

  private serializeHero(hero: HeroWithImages): HeroContentDto {
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
      images: hero.images.map((image) => this.serializeHeroImage(image)),
      createdAt: hero.createdAt.toISOString(),
      updatedAt: hero.updatedAt.toISOString(),
    };
  }

  private serializeHeroImage(image: HeroImage): HeroImageDto {
    return {
      id: image.id,
      imagePath: image.imagePath,
      sortOrder: image.sortOrder,
      createdAt: image.createdAt.toISOString(),
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
