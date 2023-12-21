import { Types } from 'mongoose';

export interface AdminMenuUpdateIndexesDto {
  indexes: {
    id: Types.ObjectId;
    parent: Types.ObjectId;
    index: number;
  }[];
}
