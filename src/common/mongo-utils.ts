import { Document } from 'mongoose';

type FormatDocResult<T> = {
  _id?: string
  id?: string,
  __v?: number
} & T

class MongoUtils {
  constructor() {
  }

  static formatDoc<T>(document: Document & T, transferId: boolean = true, removeV: boolean = true): FormatDocResult<T> {
    let result: FormatDocResult<T> = {} as any;
    const { _id, __v, ...rest } = document['_doc'];
    transferId ? result.id = _id : result._id = _id;
    if (!removeV) result.__v = __v;
    Object.assign(result, rest);
    return result;
  }
}

export default MongoUtils;