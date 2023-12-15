import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../../user/user.schema';

@Schema()
export class Folder {
  @Prop({ required: true })
  name: string;

  @Prop({
    default: null,
    type: Types.ObjectId,
    ref: 'Folder',
  })
  parent: Folder;
  
  @Prop({ default: '' })
  description: string;

  @Prop({
    default: null,
    type: Types.ObjectId,
    ref: 'User',
  })
  creator: User;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);