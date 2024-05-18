import { Icon } from 'src/common/entities/icon.entity';

export interface CategoryUpdateDto extends Icon {
  id: number;
  name?: string;
  alias?: string;
  description?: string;
}
