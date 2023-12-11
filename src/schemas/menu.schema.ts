import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Menu {
  @Prop({ required: true })
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

  @Prop({ default: true })
  enable: boolean;

  @Prop({ default: true })
  visible: boolean;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
