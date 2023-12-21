import { JoiObject } from '../types/joi-obj';
import * as Joi from 'joi';
import { DeleteDocsDto } from '../dto/delete-docs.dto';

export const deleteDocsJoi: JoiObject<DeleteDocsDto> = Joi.object({
  ids: Joi.array().items(Joi.string()).required(),
  all: Joi.boolean(),
});
