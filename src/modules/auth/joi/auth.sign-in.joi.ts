import { JoiObject } from '../../../common/types/joi-obj';
import * as Joi from 'joi';
import { AuthSignInDto } from '../dto/auth.sign-in.dto';

export const authSignInJoi: JoiObject<AuthSignInDto> = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
