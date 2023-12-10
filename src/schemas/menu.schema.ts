import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId, Types } from 'mongoose';

@Schema()
export class Menu {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  iconclass: string;

  @Prop({
    default: null,
    type: Types.ObjectId,
    ref: 'Menu',
  })
  parent: Menu;

  @Prop()
  index: number;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
