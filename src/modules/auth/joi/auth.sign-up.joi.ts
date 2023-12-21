import * as Joi from 'joi';
import { JoiObject } from '../../../common/types/joi-obj';
import { AuthSignUpDto } from '../dto/auth.sign-up.dto';
import { userEmailJoi } from '../../user/joi/user.email.joi';
import { userPasswordJoi } from '../../user/joi/user.password.joi';

export const authSignUpJoi: JoiObject<AuthSignUpDto> = Joi.object({
  username: Joi.string(),
  autoSignIn: Joi.boolean(),
  roles: Joi.array(),
})
  .concat(userEmailJoi)
  .concat(userPasswordJoi);
