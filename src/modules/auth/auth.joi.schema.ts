import { JoiSchemaObject } from '../../common/common.schema';
import * as Joi from 'joi';
import { SignInDto, SignUpDto } from './auth.dto';
import { accountSchema } from '../user/user.joi.schema';

export const signInBodySchema: JoiSchemaObject<SignInDto> = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  captchaCode: Joi.string().required(),
});

export const signUpSchema: JoiSchemaObject<SignUpDto> = Joi.object({
  username: Joi.string(),
  autoSignIn: Joi.boolean(),
  roles: Joi.array(),
}).concat(accountSchema);