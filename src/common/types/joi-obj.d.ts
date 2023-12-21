import * as Joi from 'joi';
import { ToAny } from './to-any';

export type JoiObject<T> = Joi.ObjectSchema<Required<ToAny<T>>>;
