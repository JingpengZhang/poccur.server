import { Icon } from 'src/common/entities/icon.entity';

export interface CategoryCreateDto extends Icon {
  name: string;
  alias?: string;
  description: string;
  creator: string;
}
