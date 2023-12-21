import * as Joi from 'joi';

export const idJoi = Joi.object({
  id: Joi.string().required(),
});
