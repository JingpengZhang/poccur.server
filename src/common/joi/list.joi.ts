import * as Joi from 'joi';

export const listJoi = Joi.object({
  page: Joi.number().min(0),
  pageSize: Joi.number().min(0),
});
