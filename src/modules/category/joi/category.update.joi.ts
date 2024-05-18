import { JoiObject } from '../../../common/types/joi-obj';
import { CategoryUpdateDto } from '../dto/category.update.dto';
import * as Joi from 'joi';
import { idJoi } from '../../../common/joi/id.joi';
import { iconJoi } from 'src/common/joi/icon.joi';

export const categoryUpdateJoi: JoiObject<CategoryUpdateDto> = Joi.object({
  name: Joi.string().required(),
  alias: Joi.string(),
  description: Joi.string(),
})
  .concat(idJoi)
  .concat(iconJoi);
