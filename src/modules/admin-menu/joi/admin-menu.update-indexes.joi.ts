import { JoiObject } from '../../../common/types/joi-obj';
import { AdminMenuUpdateIndexesDto } from '../dto/admin-menu.update-indexes.dto';
import * as Joi from 'joi';

export const adminMenuUpdateIndexesJoi: JoiObject<AdminMenuUpdateIndexesDto> =
  Joi.object({
    indexes: Joi.array()
      .items({
        id: Joi.string().required(),
        parent: Joi.string().required(),
        index: Joi.number().required(),
      })
      .required(),
  });
