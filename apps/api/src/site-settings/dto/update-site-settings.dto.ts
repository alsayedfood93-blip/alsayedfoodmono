import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { EmptyToUndefined } from '../../common/transforms';

export class UpdateSiteSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @EmptyToUndefined()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  whatsapp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @EmptyToUndefined()
  @IsUrl({ require_protocol: true })
  facebookUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @EmptyToUndefined()
  @IsUrl({ require_protocol: true })
  instagramUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @EmptyToUndefined()
  @IsUrl({ require_protocol: true })
  tiktokUrl?: string;
}
