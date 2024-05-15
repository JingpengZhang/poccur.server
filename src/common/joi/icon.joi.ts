import * as Joi from 'joi';
import { JoiObject } from '../types/joi-obj';
import { Icon } from '../entities/icon.entity';

export const iconJoi: JoiObject<Icon> = Joi.object({
  icon: Joi.object({
    name: Joi.string(),
    size: Joi.number(),
    color: Joi.string(),
    strokeWidth: Joi.number(),
  }),
});
