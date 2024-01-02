export interface CreateArticleDto {
  title: string;
  content: string;
  description?: string;
  password?: string;
  tags?: number[];
  categories?: number[];
  cover?: number;
}
