import { EntityId } from '../../../common/types/entity-id';

export interface CheckPasswordDto {
  id: EntityId;
  password: string;
}
