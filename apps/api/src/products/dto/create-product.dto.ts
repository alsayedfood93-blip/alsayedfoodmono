import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ToBoolean, ToStringArray } from '../../common/transforms';

export class CreateProductDto {
  @ApiProperty({ example: 'Falastin Fizz Orange' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({
    description: 'Optional custom slug; generated from title when omitted.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @ApiPropertyOptional({ example: '330ml' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  size?: string;

  @ApiPropertyOptional({ description: 'Integer price semantics (legacy).' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    type: [String],
    description: 'Ingredients as array, comma-separated, or JSON array string.',
  })
  @IsOptional()
  @ToStringArray()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @ApiProperty({ description: 'Owning category id.' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId!: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @ToBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @ToBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
