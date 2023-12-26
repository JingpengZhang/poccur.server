import { JoiObject } from '../../../common/types/joi-obj';
import { TagCreateDto } from '../dto/tag.create.dto';
import * as Joi from 'joi';

export const tagCreateJoi: JoiObject<TagCreateDto> = Joi.object({
  name: Joi.string().required(),
  alias: Joi.string(),
  description: Joi.string(),
});
