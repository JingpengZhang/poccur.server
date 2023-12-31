import { JoiObject } from '../../../common/types/joi-obj';
import { TagUpdateDto } from '../dto/tag.update.dto';
import * as Joi from 'joi';
import { idJoi } from '../../../common/joi/id.joi';

export const tagUpdateJoi: JoiObject<TagUpdateDto> = Joi.object({
  name: Joi.string().required(),
  alias: Joi.string(),
  description: Joi.string(),
}).concat(idJoi);
