import { JoiSchemaObject } from '../../../../common/common.schema';
import { CreateMenuDto, DeleteDto, GetOneByIdDto, UpdateMenuDto } from './menu.dto';
import * as Joi from 'joi';

export const createMenuSchema: JoiSchemaObject<CreateMenuDto> = Joi.object({
  name: Joi.string().required(),
  path: Joi.string().required(),
  iconclass: Joi.string().required(),
  parent: Joi.string().allow(null, ''),
  enable: Joi.boolean(),
  visible: Joi.boolean(),
});

export const updateMenuSchema: JoiSchemaObject<UpdateMenuDto> = Joi.object({
  id: Joi.string().required(),
}).concat(createMenuSchema);

export const getOneByIdSchema: JoiSchemaObject<GetOneByIdDto> = Joi.object({
  id: Joi.string().required(),
});

export const deleteSchema: JoiSchemaObject<DeleteDto> = Joi.object({
  ids: Joi.array().items(Joi.string()),
  all: Joi.boolean(),
});

export const updateIndexesSchema = Joi.object({
  indexes: Joi.required(),
});