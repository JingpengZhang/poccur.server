import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository } from 'typeorm';
import { ArticleManagerService } from '../../managers/article-manager/article.manager.service';
import { GenericService } from '../../common/services/generic.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Tag } from '../tag/tag.entity';
import { Category } from '../category/category.entity';
import { StorageService } from '../../common/services/storage.service';
import { FileType } from '../../constants/file-type.enum';
import { DeleteDto } from '../../common/dto/delete.dto';
import { number } from 'joi';
import { EntityIdDto } from '../../common/dto/entity-id.dto';
import { BcryptService } from '../../common/services/bcrypt.service';

@Injectable()
export class ArticleService extends GenericService<Article> {
  static articleStoragePathPrefix = './storage/articles';
  static articlePublicPathPrefix = './public/articles';

  constructor(
    @InjectRepository(Article) private readonly repository: Repository<Article>,
    private readonly articleManagerService: ArticleManagerService,
    private readonly storageService: StorageService,
    private readonly bcryptService: BcryptService,
  ) {
    super(repository);
  }

  async create(posterId: number, dto: CreateArticleDto) {
    const { title, tags, categories, cover, description, password, ...rest } =
      dto;

    const posterEntity = await this.articleManagerService.getUserById(posterId);

    const tagEntities = await this.articleManagerService.getTagsByIdArray(tags);

    const categoryEntities =
      await this.articleManagerService.getCategoriesByIdArray(categories);

    const coverFileEntity = await this.articleManagerService.getFileById(cover);

    // generate path
    const fileName =
      title +
      '_' +
      posterId +
      '_' +
      this.storageService.getRandomString() +
      '.md';

    let storagePath = this.storageService.getUserStoragePath(
      posterId,
      FileType.Article,
      true,
    );

    storagePath += '/' + fileName;

    // generate md file
    this.articleManagerService.storageArticleFile(dto.content, storagePath);

    const article = new Article();
    article.title = dto.title;
    article.path = this.storageService.transferToPublicPath(storagePath);
    article.storagePath = storagePath;
    article.tags = tagEntities;
    article.categories = categoryEntities;
    article.cover = coverFileEntity;
    article.poster = posterEntity;

    // 加密密码
    if (password)
      article.password = this.bcryptService.encodePassword(password);

    // if no description, generate description
    let _description = description;
    if (!description) {
      _description = this.articleManagerService.getPureText(dto.content);
    }
    article.description = _description;

    // combine other fields
    Object.assign(article, rest);

    // save repository
    await this.repository.save(article);

    return {
      id: article.id,
    };
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

  async delete(criteria: DeleteDto) {
    let ids = criteria instanceof Array ? criteria : [criteria];

    // delete file
    for await (const id of ids) {
      if (typeof id === 'number') {
        const article = await this.findOneById(id);

        if (!article) throw new BadRequestException('文章不存在');

        this.articleManagerService.deleteArticleFile(article.storagePath);
      }
    }

    return super.delete(criteria);
  }

  async detail(dto: EntityIdDto) {
    const { id } = dto;
    const article = await this.repository.findOne({
      where: {
        id,
      },
      relations: {
        tags: true,
        cover: true,
        categories: true,
      },
      select: {
        tags: {
          id: true,
          name: true,
        },
        categories: {
          id: true,
          name: true,
        },
        cover: {
          path: true,
        },
      },
    });

    if (!article) throw new BadRequestException('文章不存在');

    delete article.password;
    delete article.storagePath;

    // get content
    return article;
  }
}
