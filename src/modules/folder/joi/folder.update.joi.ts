import { JoiObject } from '../../../common/types/joi-obj';
import { FolderUpdateDto } from '../dto/folder.update.dto';
import * as Joi from 'joi';
import { idJoi } from '../../../common/joi/id.joi';

export const folderUpdateJoi: JoiObject<FolderUpdateDto> = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  parent: Joi.number(),
}).concat(idJoi);
