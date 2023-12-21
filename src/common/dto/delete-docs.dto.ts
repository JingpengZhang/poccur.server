import { Types } from 'mongoose';

export interface DeleteDocsDto {
  ids: Types.ObjectId[];
  all?: boolean;
}
