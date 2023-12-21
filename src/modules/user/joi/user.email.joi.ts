import * as Joi from 'joi';

export const userEmailJoi = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': '邮箱格式不正确',
    'any.required': '邮箱必填',
    'string.empty': '邮箱不能为空',
  }),
})