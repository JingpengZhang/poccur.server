import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Menu {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  iconclass: string;

  @Prop({
    default(val: any): any {
      return false;
    },
  })
  group: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' })
  parent: Menu;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
