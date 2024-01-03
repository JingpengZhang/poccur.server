import { Injectable } from '@nestjs/common';
import { TagService } from '../../modules/tag/tag.service';
import { In } from 'typeorm';
import { CategoryService } from '../../modules/category/category.service';
import { FileService } from '../../modules/file/file.service';
import { UserService } from '../../modules/user/user.service';
import { Converter } from 'showdown';

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

  /**
   * 获取纯净的字符串(包含截取功能),去除markdown中的语法标签,空格及回车
   * @param str 原字符串
   * @param wordCount 截取的字符串字数
   */
  getPureText(str: string, wordCount = 300) {
    const converter = new Converter();

    // markdown to html
    const html = converter.makeHtml(str);

    // remove html tag
    let result = html.replace(/<[^>]+>/g, '');

    // truncate strings
    if (result.length > wordCount) result = result.substring(0, wordCount);

    // remove blank
    result = result.replace(/\ +/g, '');

    // remove line feed
    result = result.replace(/[\r\n]/g, '');

    return result;
  }
}
