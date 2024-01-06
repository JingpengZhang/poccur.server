import { EntityId } from '../../../common/types/entity-id';
import { ListDto } from '../../../common/dto/list.dto';

export interface GetListByTagDto extends ListDto {
  tagId: EntityId;
}
