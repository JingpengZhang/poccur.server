import { JoiSchemaObject } from '../../common/common.schema';
import { DeleteFilesDto } from './file.dto';
import * as Joi from 'joi';

export const deleteFilesSchema: JoiSchemaObject<DeleteFilesDto> = Joi.object({
  ids: Joi.array().items(Joi.string()).required(),
});