import * as Joi from 'joi';
import { ObjectSchema } from 'joi';

export interface CreateMenuDto {
  name: string;
  path: string;
  icon: string;
  parent: string;
}

export const createMenuSchema = Joi.object({
  name: Joi.string().required(),
  path: Joi.string().required(),
  iconclass: Joi.string().required(),
  parent: Joi.string().allow(null, ''),
}).required();

export interface UpdateMenuDto extends CreateMenuDto {
  id: string;
}

export const updateMenuSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  path: Joi.string().required(),
  iconclass: Joi.string().required(),
  parent: Joi.string().allow(null, ''),
}).required();


export interface GetOneByIdDto {
  id: string;
}

export const getOneByIdSchema = Joi.object({
  id: Joi.string().required(),
});

export interface DeleteDto {
  ids: string[];
  all?: boolean;
}

export const deleteSchema: ObjectSchema<ToAny<DeleteDto>> = Joi.object({
  ids: Joi.array().items(Joi.string()).required(),
  all: Joi.boolean(),
});

export interface UpdateIndexesDto {
  indexes: Array<{
    id: string,
    index: number,
    parent: string | null
  }>;
}

export const updateIndexesSchema = Joi.object({
  indexes: Joi.required(),
});