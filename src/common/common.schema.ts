import * as Joi from 'joi';
import { GetListDto } from './common.dto';
import { ObjectSchema } from 'joi';

export const GetListSchema: ObjectSchema<ToAny<GetListDto>> = Joi.object({
    page: Joi.number().min(0),
    pageSize: Joi.number().min(0),
  },
);