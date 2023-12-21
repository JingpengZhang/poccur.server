import { JoiObject } from '../../../common/types/joi-obj';
import { TagUpdateDto } from '../dto/tag.update.dto';
import * as Joi from 'joi';
import { idJoi } from '../../../common/joi/id.joi';
import { tagCreateJoi } from './tag.create.joi';

export const tagUpdateJoi: JoiObject<TagUpdateDto> = Joi.object({})
  .concat(idJoi)
  .concat(tagCreateJoi);
