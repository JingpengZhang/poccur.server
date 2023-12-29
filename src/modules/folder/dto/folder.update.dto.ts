import { FolderCreateDto } from './folder.create.dto';
import { EntityIdDto } from '../../../common/dto/entity-id.dto';

export interface FolderUpdateDto
  extends Partial<FolderCreateDto>,
    EntityIdDto {}
