import { CategoryCreateDto } from './category.create.dto';

export interface CategoryUpdateDto {
  id: number;
  name?: string;
  alias?: string;
  description?: string;
}
