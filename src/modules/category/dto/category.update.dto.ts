import { CategoryCreateDto } from './category.create.dto';

export interface CategoryUpdateDto extends CategoryCreateDto {
  id: string;
}
