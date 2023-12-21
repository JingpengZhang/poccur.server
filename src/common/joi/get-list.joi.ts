import * as Joi from 'joi';

export const getListJoi = Joi.object({
  page: Joi.number().min(0),
  pageSize: Joi.number().min(0),
});
