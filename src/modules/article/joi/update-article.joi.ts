import * as Joi from 'joi';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { idJoi } from '../../../common/joi/id.joi';
import {
  articleCategoriesJoi,
  articleContentJoi,
  articleCoverJoi,
  articleDescriptionJoi,
  articlePasswordJoi,
  articleTagsJoi,
  articleTitleJoi,
} from './article.fileds.joi';
import { JoiObject } from '../../../common/types/joi-obj';

export const updateArticleJoi: JoiObject<UpdateArticleDto> = Joi.object({
  title: articleTitleJoi,
  content: articleContentJoi,
  description: articleDescriptionJoi,
  password: articlePasswordJoi,
  tags: articleTagsJoi,
  categories: articleCategoriesJoi,
  cover: articleCoverJoi,
}).concat(idJoi);
