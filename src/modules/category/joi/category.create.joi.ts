import { iconJoi } from 'src/common/joi/icon.joi';
import { JoiObject } from '../../../common/types/joi-obj';
import { CategoryCreateDto } from '../dto/category.create.dto';
import * as Joi from 'joi';

export const categoryCreateJoi: JoiObject<CategoryCreateDto> = Joi.object({
  name: Joi.string().required(),
  alias: Joi.string(),
  description: Joi.string(),
}).concat(iconJoi);
