import { JoiSchemaObject } from '../../common/common.schema';
import * as Joi from 'joi';
import { SignInDto } from './auth.dto';

export const signInSchema: JoiSchemaObject<SignInDto> = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  captchaCode: Joi.string().required(),
});