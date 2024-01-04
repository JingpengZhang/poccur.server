import * as Joi from 'joi';

export const articleTitleJoi = Joi.string();

export const articleContentJoi = Joi.string();

export const articleDescriptionJoi = Joi.string().allow('');

export const articlePasswordJoi = Joi.string().allow('');

export const articleTagsJoi = Joi.array().items(Joi.number());

export const articleCategoriesJoi = Joi.array().items(Joi.number());

export const articleCoverJoi = Joi.number();
