import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('hero')
  @ApiOperation({ summary: 'Get hero content' })
  getHero() {
    return this.contentService.getHero();
  }

  @Get('ceo')
  @ApiOperation({ summary: 'Get CEO message' })
  getCeo() {
    return this.contentService.getCeo();
  }
}
