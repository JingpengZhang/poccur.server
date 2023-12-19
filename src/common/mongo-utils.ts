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

  static formatDocs<T>(documents: Array<Document & T>, transferId: boolean = true, removeV: boolean = true): Array<FormatDocResult<T>> {
    let result: Array<FormatDocResult<T>> = [];

    documents.forEach(doc => {
      result.push(MongoUtils.formatDoc(doc, transferId, removeV));
    });

    return result;
  }
}

export default MongoUtils;