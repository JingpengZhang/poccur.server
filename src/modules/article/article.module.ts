import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { MarkdownService } from '../../common/services/markdown.service';
import { ArticleManagerModule } from '../../managers/article-manager/article.manager.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), ArticleManagerModule],
  controllers: [ArticleController],
  providers: [ArticleService, MarkdownService],
  exports: [ArticleService],
})
export class ArticleModule {}