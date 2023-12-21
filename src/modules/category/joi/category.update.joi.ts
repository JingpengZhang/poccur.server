import { JoiObject } from '../../../common/types/joi-obj';
import { CategoryUpdateDto } from '../dto/category.update.dto';
import * as Joi from 'joi';
import { idJoi } from '../../../common/joi/id.joi';
import { categoryCreateJoi } from './category.create.joi';

export const categoryUpdateJoi: JoiObject<CategoryUpdateDto> = Joi.object({})
  .concat(idJoi)
  .concat(categoryCreateJoi);
