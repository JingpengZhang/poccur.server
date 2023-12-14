import { JoiSchemaObject } from '../../common/common.schema';
import { CreateUserDto } from './user.dto';
import * as Joi from 'joi';

export const accountSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': '邮箱格式不正确',
    'any.required': '邮箱必填',
    'string.empty': '邮箱不能为空',
  }),
  password: Joi.string().regex(/^(?![^a-zA-Z]+$)(?!\D+$)/).error(new Error('密码格式不正确,长度最少8位,且至少包含一个字母和一个数字')),
});

export const createUserSchema: JoiSchemaObject<CreateUserDto> = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': '邮箱格式不正确',
    'any.required': '邮箱必填',
    'string.empty': '邮箱不能为空',
  }),
}).concat(accountSchema);