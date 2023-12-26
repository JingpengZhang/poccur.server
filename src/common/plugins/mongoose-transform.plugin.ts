import { get, Schema } from 'mongoose';

const MongooseTransformPlugin = (schema: Schema) => {
  schema.set('toJSON', {
    transform: (doc, ret, options) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    },
  });
  schema.set('timestamps', true);
  schema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });
};

export default MongooseTransformPlugin;
