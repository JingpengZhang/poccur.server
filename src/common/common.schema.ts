import * as Joi from 'joi';
import { GetListDto } from './common.dto';

export type JoiSchemaObject<T> = Joi.ObjectSchema<Required<ToAny<T>>>

export const GetListSchema: JoiSchemaObject<GetListDto> = Joi.object({
    page: Joi.number().min(0),
    pageSize: Joi.number().min(0),
  },
);