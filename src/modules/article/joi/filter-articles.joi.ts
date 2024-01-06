import { JoiObject } from '../../../common/types/joi-obj';
import { FilterArticleDto } from '../dto/filter-article.dto';
import * as Joi from 'joi';
import { idJoi } from '../../../common/joi/id.joi';

export const filterArticlesJoi: JoiObject<FilterArticleDto> = Joi.object({
  tagId: idJoi,
  categoryId: idJoi,
  title: Joi.string(),
  posterId: idJoi,
  createdStartDate: Joi.date(),
  createdEndDate: Joi.date(),
  updatedStartDate: Joi.date(),
  updatedEndDate: Joi.date(),
});
