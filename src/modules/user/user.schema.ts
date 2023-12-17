import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../auth/role.enum';
import { Types } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  username: string;

  @Prop({
    default: null,
    type: Types.ObjectId,
    ref: 'File',
  })
  avatar: string;

  @Prop()
  description: string;

  @Prop()
  registerTime: string;

  @Prop({
    default: [Role.User],
  })
  roles: Role[];

  @Prop()
  career: string;
}

export const UserSchema = SchemaFactory.createForClass(User);