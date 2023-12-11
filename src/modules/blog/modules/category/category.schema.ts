import { CreateCategoryDto, DeleteCategoryDto, UpdateCategoryDto } from './category.dto';
import * as Joi from 'joi';
import { JoiSchemaObject } from '../../../../common/common.schema';

export const createCategorySchema: JoiSchemaObject<CreateCategoryDto> = Joi.object({
  name: Joi.string().required(),
  alias: Joi.string().required(),
  description: Joi.string(),
});

export const updateCategorySchema: JoiSchemaObject<UpdateCategoryDto> = Joi.object({
  id: Joi.string().required(),
}).concat(createCategorySchema);

export const deleteCategorySchema: JoiSchemaObject<DeleteCategoryDto> = Joi.object({
  ids: Joi.array().items(Joi.string()),
  all: Joi.boolean(),
});