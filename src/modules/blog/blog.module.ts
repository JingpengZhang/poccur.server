import { Module } from '@nestjs/common';
import { CategoryModule } from './modules/category/category.module';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [CategoryModule],
  // controllers: [BlogController],
  // providers: [BlogService],
})
export class BlogModule {}
