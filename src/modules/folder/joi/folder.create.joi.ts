import * as Joi from 'joi';
import { JoiObject } from '../../../common/types/joi-obj';
import { FolderCreateDto } from '../dto/folder.create.dto';
import {
  FolderDescriptionJoi,
  FolderNameJoi,
  FolderParentJoi,
} from './folder.fields.joi';

export const folderCreateJoi: JoiObject<FolderCreateDto> = Joi.object({
  name: FolderNameJoi,
  description: FolderDescriptionJoi,
  parent: FolderParentJoi,
});
