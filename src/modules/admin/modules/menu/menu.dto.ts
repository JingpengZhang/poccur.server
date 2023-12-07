import * as Joi from 'joi';
import { Types } from 'mongoose';
import { ObjectSchema } from 'joi';

export interface CreateMenuDto {
  name: string;
  path: string;
  icon: string;
  parentId: Types.ObjectId;
  group?: boolean;
}

export const createMenuSchema = Joi.object({
  name: Joi.string().required(),
  path: Joi.string().required(),
  iconclass: Joi.string().required(),
  parentId: Joi.string(),
  group: Joi.boolean(),
}).required();

export interface UpdateMenuDto extends CreateMenuDto {
  id: string;
}

export const updateMenuSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  path: Joi.string().required(),
  iconclass: Joi.string().required(),
  parentId: Joi.string(),
  group: Joi.boolean(),
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