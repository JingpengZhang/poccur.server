import { JoiSchemaObject } from '../common/common.schema';
import { DeleteDocsDto } from '../dto/common.dto';
import * as Joi from 'joi';

export const deleteDocsJoiSchema: JoiSchemaObject<DeleteDocsDto> = Joi.object({
  ids: Joi.array().items(Joi.string()).required(),
  all: Joi.boolean(),
});