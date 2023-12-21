import * as Joi from 'joi';

export const userRolesJoi = Joi.object({
  roles: Joi.array().items(Joi.number()),
});
