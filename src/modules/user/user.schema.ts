import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  username: string;

  @Prop()
  avatar: string;

  @Prop()
  description: string;

  @Prop()
  registerTime: string;
}

export const UserSchema = SchemaFactory.createForClass(User);