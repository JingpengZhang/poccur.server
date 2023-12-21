import { JoiObject } from '../../../common/types/joi-obj';
import { CategoryCreateDto } from '../dto/category.create.dto';
import * as Joi from 'joi';

export const categoryCreateJoi: JoiObject<CategoryCreateDto> = Joi.object({
  name: Joi.string().required(),
  alias: Joi.string().required(),
  description: Joi.string(),
});
