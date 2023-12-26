import { JoiObject } from '../types/joi-obj';
import { DeleteQueryDto } from '../dto/delete-query.dto';
import * as Joi from 'joi';

export const deleteQueryJoi: JoiObject<DeleteQueryDto> = Joi.object({
  data: Joi.required(),
});
