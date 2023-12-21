import { JoiObject } from '../../../common/types/joi-obj';
import { UserCreateDto } from '../dto/user.create.dto';
import * as Joi from 'joi';
import { userEmailJoi } from './user.email.joi';
import { userPasswordJoi } from './user.password.joi';
import { userRolesJoi } from './user.roles.joi';

export const userCreateJoi:JoiObject<UserCreateDto> = Joi.object({
  username:Joi.string(),
}).concat(userEmailJoi).concat(userPasswordJoi).concat(userRolesJoi)