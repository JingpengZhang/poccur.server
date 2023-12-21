import * as Joi from 'joi';
import { JoiObject } from '../../../common/types/joi-obj';
import { UserUpdateDto } from '../dto/user.update.dto';
import { userRolesJoi } from './user.roles.joi';
import { idJoi } from '../../../common/joi/id.joi';

export const userUpdateJoi:JoiObject<UserUpdateDto> = Joi.object({
  username:Joi.string(),
  description:Joi.string(),
  career: Joi.string(),
  city:Joi.string(),
  company:Joi.string(),
  website: Joi.string(),
}).concat(userRolesJoi).concat(idJoi)