import * as Joi from 'joi';

export const FolderNameJoi = Joi.string().required();

export const FolderDescriptionJoi = Joi.string();

export const FolderParentJoi = Joi.number();
