import { ObjectId } from 'typeorm/driver/mongodb/typings';

export type DeleteDto =
  | string
  | string[]
  | number
  | number[]
  | Date
  | Date[]
  | ObjectId
  | ObjectId[];
