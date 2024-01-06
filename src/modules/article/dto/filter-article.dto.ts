import { EntityId } from '../../../common/types/entity-id';
import { ListDto } from '../../../common/dto/list.dto';

export interface FilterArticleDto extends ListDto {
  tagId?: EntityId;
  categoryId?: EntityId;
  title?: string;
  posterId?: EntityId;
  createdStartDate?: Date;
  createdEndDate?: Date;
  updatedStartDate?: Date;
  updatedEndDate?: Date;
}
