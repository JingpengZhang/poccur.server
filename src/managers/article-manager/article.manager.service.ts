import { Injectable } from '@nestjs/common';
import { TagService } from '../../modules/tag/tag.service';
import { In } from 'typeorm';
import { CategoryService } from '../../modules/category/category.service';
import { FileService } from '../../modules/file/file.service';
import { UserService } from '../../modules/user/user.service';

@Injectable()
export class ArticleManagerService {
  constructor(
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
    private readonly fileService: FileService,
    private readonly userService: UserService,
  ) {}

  async getUserById(userId: number) {
    return await this.userService.findOneById(userId);
  }

  async getTagsByIdArray(tagIds: number[]) {
    return await this.tagService.find({
      where: {
        id: In(tagIds),
      },
    });
  }

  async getCategoriesByIdArray(categoryIds: number[]) {
    return await this.categoryService.find({
      where: {
        id: In(categoryIds),
      },
    });
  }

  async getFileById(fileId: number) {
    return await this.fileService.findOneById(fileId);
  }
}
