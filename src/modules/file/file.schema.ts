import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FileType } from '../../common/file-type-enums';
import { Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Folder } from '../client/folder/folder.schema';

export interface FileExtraProperty {
  thumb?: string; // id
  width?: number;
  height?: number;

}

@Schema()
export class File {
  @Prop({
    required: true,
    unique: true,
  })
  path: string;

  @Prop({
    required: true,
    unique: true,
  })
  filename: string;

  @Prop({
    required: true,
  })
  type: FileType;

  @Prop({
    required: true,
  })
  filesize: number;

  @Prop({
    required: true,
  })
  extension: string;

  @Prop({
    type: Object,
  })
  extra: FileExtraProperty;

  @Prop({ required: true })
  uploadTime: string;

  @Prop({ default: '' })
  description: string;

  @Prop({
    default: null,
    type: Types.ObjectId,
    ref: 'File',
  })
  virtualFolder: Folder;

  @Prop({
    default: null,
    type: Types.ObjectId,
    ref: 'User',
  })
  uploader: User;

}

export const FileSchema = SchemaFactory.createForClass(File);