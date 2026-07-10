import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ToBoolean } from '../../common/transforms';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Mineral Water' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiPropertyOptional({
    description: 'Optional custom slug; generated from title when omitted.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @ToBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
