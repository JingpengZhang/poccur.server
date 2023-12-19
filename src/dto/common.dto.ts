import { Types } from 'mongoose';

export interface DeleteDocsDto {
  ids: Types.ObjectId[];
  all?: boolean;
}

export interface DocsListDto {
  skip: number;
  limit: number;
}