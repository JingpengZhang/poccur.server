import { Module } from '@nestjs/common';
import { ArticleManagerService } from './article.manager.service';
import { TagModule } from '../../modules/tag/tag.module';
import { CategoryModule } from '../../modules/category/category.module';
import { FileModule } from '../../modules/file/file.module';
import { UserModule } from '../../modules/user/user.module';
import { MarkdownService } from '../../common/services/markdown.service';
import { StorageService } from '../../common/services/storage.service';
import { BcryptService } from '../../common/services/bcrypt.service';

@Module({
  imports: [TagModule, CategoryModule, FileModule, UserModule],
  providers: [
    ArticleManagerService,
    MarkdownService,
    StorageService,
    BcryptService,
  ],
  exports: [ArticleManagerService],
})
export class ArticleManagerModule {}
