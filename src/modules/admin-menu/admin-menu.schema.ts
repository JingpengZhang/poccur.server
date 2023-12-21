import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class AdminMenu {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  iconclass: string;

  @Prop({
    default: null,
    type: Types.ObjectId,
    ref: 'AdminMenu',
  })
  parent: AdminMenu;

  @Prop()
  index: number;

  @Prop({ default: true })
  enable: boolean;

  @Prop({ default: true })
  visible: boolean;
}

export const AdminMenuSchema = SchemaFactory.createForClass(AdminMenu);
