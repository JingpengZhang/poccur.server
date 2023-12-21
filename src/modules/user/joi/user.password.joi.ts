import * as Joi from 'joi';

export const userPasswordJoi = Joi.object({
  password: Joi.string()
    .required()
    .regex(/^(?![^a-zA-Z]+$)(?!\D+$)/)
    .messages({
      'any.required': '密码必填',
      'string.empty': '密码不能为空',
      'string.pattern.base':
        '密码格式不正确,长度最少8位,且至少包含一个字母和一个数字',
    }),
});
