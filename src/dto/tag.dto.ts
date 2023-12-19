export interface CreateTagDto {
  name: string;
  creator: string;
}

export interface UpdateTagDto extends CreateTagDto {
  id: string;
}