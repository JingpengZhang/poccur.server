import { JoiObject } from '../../../common/types/joi-obj';
import { AdminMenuCreateDto } from '../dto/admin-menu.create.dto';
import * as Joi from 'joi';

export const adminMenuCreateJoi: JoiObject<AdminMenuCreateDto> = Joi.object({
  name: Joi.string().required(),
  path: Joi.string().required(),
  iconclass: Joi.string().required(),
  parent: Joi.string().allow(null, ''),
  enable: Joi.boolean(),
  visible: Joi.boolean(),
});
