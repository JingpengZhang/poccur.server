import { JoiObject } from '../../../common/types/joi-obj';
import { AdminMenuUpdateDto } from '../dto/admin-menu.update.dto';
import * as Joi from 'joi';
import { adminMenuCreateJoi } from './admin-menu.create.joi';
import { idJoi } from '../../../common/joi/id.joi';

export const adminMenuUpdateJoi: JoiObject<AdminMenuUpdateDto> = Joi.object({})
  .concat(idJoi)
  .concat(adminMenuCreateJoi);
