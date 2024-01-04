import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository } from 'typeorm';
import { ArticleManagerService } from '../../managers/article-manager/article.manager.service';
import { GenericService } from '../../common/services/generic.service';
import * as dayjs from 'dayjs';
import { customAlphabet } from 'nanoid';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Tag } from '../tag/tag.entity';
import { Category } from '../category/category.entity';

@Injectable()
export class ArticleService extends GenericService<Article> {
  static articleStoragePathPrefix = './storage/articles';
  static articlePublicPathPrefix = './public/articles';

  constructor(
    @InjectRepository(Article) private readonly repository: Repository<Article>,
    private readonly articleManagerService: ArticleManagerService,
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
    this.articleManagerService.storageArticleFile(
      dto.content,
      ArticleService.articleStoragePathPrefix + path,
    );

    // save repository
    await this.repository.save(article);
  }

  async update(dto: UpdateArticleDto) {
    const { id, tags, categories, cover, content, description, ...rest } = dto;

    const article = await this.repository.findOne({
      where: {
        id,
      },
      relations: {
        cover: true,
      },
    });

    if (!article) throw new BadRequestException('待修改文章不存在');

    let tagEntities: Tag[] = [];
    if (tags)
      tagEntities = await this.articleManagerService.getTagsByIdArray(tags);
    article.tags = tagEntities;

    let categoryEntities: Category[] = [];
    if (categories)
      categoryEntities =
        await this.articleManagerService.getCategoriesByIdArray(categories);
    article.categories = categoryEntities;

    if (cover) {
      // Find out if there are other articles that are being used.
      if (article.cover) {
        const articles = await this.repository.find({
          where: {
            cover: {
              id: article.cover.id,
            },
          },
        });
        // if articles array is empty,delete this cover file
        if (articles.length === 1 && articles[0].id === article.id) {
          await this.articleManagerService.deleteCover(cover);
        }
      }

      article.cover = await this.articleManagerService.getFileById(cover);
    }

    const articleContent = this.articleManagerService.readArticleContent(
      article.storagePath,
    );

    if (content && !description) {
      let _description = article.description;

      // if the article`s description is automatically generate
      const isAutomaticallyGenerate = article.description === articleContent;

      if (isAutomaticallyGenerate) {
        _description = this.articleManagerService.getPureText(content);
      }

      article.description = _description;
    }

    if (content && articleContent !== content) {
      // replace article file content
      this.articleManagerService.replaceArticleFileContent(
        content,
        article.storagePath,
      );
    }

    // combine rest arguments
    Object.assign(article, rest);

    // save article entity
    await this.repository.save(article);

    return;
  }
}
