import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../modules/user/user.schema';

@Schema()
export class Tag {
  @Prop()
  name: string;

  @Prop({
    default: null,
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  })
  creator: User;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
