import { JoiObject } from '../../../common/types/joi-obj';
import { AdminMenuUpdateTreeDto } from '../dto/admin-menu.update-tree.dto';
import * as Joi from 'joi';

export const adminMenuUpdateTreeJoi: JoiObject<AdminMenuUpdateTreeDto> =
  Joi.object({
    indexes: Joi.array()
      .items({
        id: Joi.number().required(),
        index: Joi.number().required(),
        parent: Joi.number().required(),
      })
      .required(),
  });
