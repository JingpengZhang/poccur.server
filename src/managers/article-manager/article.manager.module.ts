import { Module } from '@nestjs/common';
import { ArticleManagerService } from './article.manager.service';
import { TagModule } from '../../modules/tag/tag.module';
import { CategoryModule } from '../../modules/category/category.module';
import { FileModule } from '../../modules/file/file.module';
import { UserModule } from '../../modules/user/user.module';

@Module({
  imports: [TagModule, CategoryModule, FileModule, UserModule],
  providers: [ArticleManagerService],
  exports: [ArticleManagerService],
})
export class ArticleManagerModule {}