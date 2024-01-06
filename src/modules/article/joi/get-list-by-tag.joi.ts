import { JoiObject } from '../../../common/types/joi-obj';
import { GetListByTagDto } from '../dto/get-list-by-tag.dto';
import * as Joi from 'joi';
import { listJoi } from '../../../common/joi/list.joi';
import { idJoi } from '../../../common/joi/id.joi';

export const getListByTagJoi: JoiObject<GetListByTagDto> = Joi.object({
  tagId: idJoi,
}).concat(listJoi);
