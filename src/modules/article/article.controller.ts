import { Body, Controller, Post } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('article')
export class ArticleController {
  constructor(private service: ArticleService) {}

  @Post('create')
  async create(@CurrentUser() userId: number, @Body() body: CreateArticleDto) {
    await this.service.create(userId, body);
  }
}
