import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository } from 'typeorm';
import { ArticleManagerService } from '../../managers/article-manager/article.manager.service';
import { MarkdownService } from '../../common/services/markdown.service';
import { GenericService } from '../../common/services/generic.service';
import * as dayjs from 'dayjs';
import { customAlphabet } from 'nanoid';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticleService extends GenericService<Article> {
  static articleStoragePathPrefix = './storage/articles';
  static articlePublicPathPrefix = './public/articles';

  constructor(
    @InjectRepository(Article) private readonly repository: Repository<Article>,
    private readonly articleManagerService: ArticleManagerService,
    private readonly markdownService: MarkdownService,
  ) {
    super(repository);
  }

  async create(posterId: number, dto: CreateArticleDto) {
    const { title, tags, categories, cover, description, ...rest } = dto;

    const posterEntity = await this.articleManagerService.getUserById(posterId);

    const tagEntities = await this.articleManagerService.getTagsByIdArray(tags);

    const categoryEntities =
      await this.articleManagerService.getCategoriesByIdArray(categories);

    const coverFileEntity = await this.articleManagerService.getFileById(cover);

    // generate path
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 4);
    const day = dayjs();
    const path =
      '/' +
      day.format('YYYYMMDD') +
      '/' +
      title +
      '_' +
      posterId +
      '_' +
      nanoid() +
      '.md';

    const article = new Article();
    article.title = dto.title;
    article.path = ArticleService.articlePublicPathPrefix + path;
    article.storagePath = ArticleService.articleStoragePathPrefix + path;
    article.tags = tagEntities;
    article.categories = categoryEntities;
    article.cover = coverFileEntity;
    article.poster = posterEntity;

    // if no description, generate description
    let _description = description;
    if (!description) {
      _description = this.articleManagerService.getPureText(dto.content);
    }
    article.description = _description;

    // combine other fields
    Object.assign(article, rest);

    // generate md file
    await this.markdownService.create(
      dto.content,
      ArticleService.articleStoragePathPrefix + path,
    );

    // save repository
    await this.repository.save(article);
  }
}
