import { JoiObject } from '../../../common/types/joi-obj';
import { AdminMenuCreateDto } from '../dto/admin-menu.create.dto';
import * as Joi from 'joi';

export const adminMenuCreateJoi: JoiObject<AdminMenuCreateDto> = Joi.object({
  name: Joi.string().required(),
  path: Joi.string().required(),
  iconClass: Joi.string().required(),
  parent: Joi.number().allow(null, ''),
  enable: Joi.boolean(),
  visible: Joi.boolean(),
});
