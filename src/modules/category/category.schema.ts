import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

// import { User } from '../user/user.schema';

@Schema()
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  alias: string;

  @Prop()
  description: string;
  //
  // @Prop({
  //   default: null,
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'User',
  // })
  // creator: User;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
