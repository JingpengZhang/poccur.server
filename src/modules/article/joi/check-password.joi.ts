import { JoiObject } from '../../../common/types/joi-obj';
import { CheckPasswordDto } from '../dto/check-password.dto';
import * as Joi from 'joi';
import { idJoi } from '../../../common/joi/id.joi';

export const checkPasswordJoi: JoiObject<CheckPasswordDto> = Joi.object({
  password: Joi.string(),
}).concat(idJoi);
