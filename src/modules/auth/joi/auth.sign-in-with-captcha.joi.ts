import { JoiObject } from '../../../common/types/joi-obj';
import { AuthSignInWithCaptchaDto } from '../dto/auth.sign-in-with-captcha.dto';
import * as Joi from 'joi';

export const authSignInWithCaptchaJoi: JoiObject<AuthSignInWithCaptchaDto> =
  Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    captchaCode: Joi.string().required(),
  });
