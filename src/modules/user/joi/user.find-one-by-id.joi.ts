import { JoiObject } from '../../../common/types/joi-obj';
import { UserFindOneByIdDto } from '../dto/user.find-one-by-id.dto';
import * as Joi from 'joi';
import { idJoi } from '../../../common/joi/id.joi';

export const userFindOneByIdJoi:JoiObject<UserFindOneByIdDto> = Joi.object({

}).concat(idJoi)