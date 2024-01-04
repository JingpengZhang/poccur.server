import * as Joi from 'joi';
import { JoiObject } from '../../../common/types/joi-obj';
import { CreateArticleDto } from '../dto/create-article.dto';
import {
  articleCategoriesJoi,
  articleContentJoi,
  articleCoverJoi,
  articleDescriptionJoi,
  articlePasswordJoi,
  articleTagsJoi,
  articleTitleJoi,
} from './article.fileds.joi';

export const createArticleJoi: JoiObject<CreateArticleDto> = Joi.object({
  title: articleTitleJoi.required(),
  content: articleContentJoi.required(),
  description: articleDescriptionJoi,
  password: articlePasswordJoi,
  tags: articleTagsJoi,
  categories: articleCategoriesJoi,
  cover: articleCoverJoi,
});
