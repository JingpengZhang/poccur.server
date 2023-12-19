import { JoiSchemaObject } from '../common/common.schema';
import { CreateTagDto, UpdateTagDto } from '../dto/tag.dto';
import * as Joi from 'joi';

export const createTagSchema: JoiSchemaObject<CreateTagDto> = Joi.object({
  name: Joi.string().required(),
});

export const updateTagSchema: JoiSchemaObject<UpdateTagDto> = Joi.object({
  id: Joi.string().required(),
}).concat(createTagSchema);