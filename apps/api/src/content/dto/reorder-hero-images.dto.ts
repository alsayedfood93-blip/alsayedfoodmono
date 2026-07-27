import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class ReorderHeroImagesDto {
  @ApiProperty({
    type: [Number],
    description: 'Hero image ids in the desired display order (ascending).',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  orderedIds!: number[];
}
