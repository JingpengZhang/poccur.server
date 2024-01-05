import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { ArticleManagerModule } from '../../managers/article-manager/article.manager.module';
import { StorageService } from '../../common/services/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), ArticleManagerModule],
  controllers: [ArticleController],
  providers: [ArticleService, StorageService],
  exports: [ArticleService],
})
export class ArticleModule {}
