import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ToBoolean } from '../../common/transforms';

function parseIdList(value: unknown): number[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.map((item) => Number(item)).filter((n) => Number.isFinite(n));
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => Number(item))
          .filter((n) => Number.isFinite(n));
      }
    } catch {
      // Fall through to comma-separated parsing.
    }
    return trimmed
      .split(',')
      .map((part) => Number(part.trim()))
      .filter((n) => Number.isFinite(n));
  }
  return undefined;
}

export class UpdateHeroDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  eyebrow?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  highlightedText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  primaryButtonText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  primaryButtonLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  secondaryButtonText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  secondaryButtonLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ToBoolean()
  isActive?: boolean;

  /** Existing background image ids to remove (JSON array or comma-separated). */
  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @Transform(({ value }) => parseIdList(value))
  @IsArray()
  @IsInt({ each: true })
  deleteImageIds?: number[];

  /** Desired order of remaining existing image ids (JSON array or comma-separated). */
  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @Transform(({ value }) => parseIdList(value))
  @IsArray()
  @IsInt({ each: true })
  imageOrder?: number[];
}
