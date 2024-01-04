import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { createArticleJoi } from './joi/create-article.joi';
import { updateArticleJoi } from './joi/update-article.joi';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('article')
export class ArticleController {
  constructor(private service: ArticleService) {}

  @Post('create')
  @UsePipes(new JoiValidationPipe(createArticleJoi))
  async create(@CurrentUser() userId: number, @Body() body: CreateArticleDto) {
    await this.service.create(userId, body);
  }

  @Post('update')
  @UsePipes(new JoiValidationPipe(updateArticleJoi))
  async update(@Body() body: UpdateArticleDto) {
    await this.service.update(body);
  }
}
