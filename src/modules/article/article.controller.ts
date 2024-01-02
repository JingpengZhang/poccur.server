import { Body, Controller, Post, Req } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { FastifyRequest } from 'fastify';

@Controller('article')
export class ArticleController {
  constructor(private service: ArticleService) {}

  @Post('create')
  async create(@Req() request: FastifyRequest, @Body() body: CreateArticleDto) {
    await this.service.create(request['user'].id, body);
  }
}
