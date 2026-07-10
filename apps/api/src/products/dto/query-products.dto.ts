import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ToBoolean } from '../../common/transforms';

export class QueryProductsDto {
  @ApiPropertyOptional({ description: 'Filter by category slug.' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter to featured products only.' })
  @IsOptional()
  @ToBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ description: 'Search by title/description.' })
  @IsOptional()
  @IsString()
  search?: string;
}
