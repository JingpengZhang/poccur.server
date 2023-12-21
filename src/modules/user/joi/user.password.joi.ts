import * as Joi from 'joi';

export const userPasswordJoi = Joi.object({
  password: Joi.string().regex(/^(?![^a-zA-Z]+$)(?!\D+$)/).error(new Error('密码格式不正确,长度最少8位,且至少包含一个字母和一个数字')),
})