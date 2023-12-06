export interface CreateCategoryDto {
  name: string;
  alias: string;
  description: string;
}

export interface UpdateCategoryDto extends CreateCategoryDto {
  id: string;
}
