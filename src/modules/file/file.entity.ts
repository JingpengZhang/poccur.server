import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FileType } from '../../constants/file-type.enum';
import { User } from '../user/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { Folder } from '../folder/folder.entity';

export interface FileExtraProperty {
  thumb?: string; // id
  width?: number;
  height?: number;
}

@Entity()
export class File extends BaseEntity {
  @Column()
  path: string;

  @Column()
  filename: string;

  @Column()
  type: FileType;

  @Column()
  filesize: number;

  @Column()
  extension: string;

  @Column('json')
  extra: Object;

  @Column({ default: '' })
  description: string;

  @Column()
  storagePath: string;

  @ManyToOne(() => User, (user) => user.files, { onDelete: 'CASCADE' })
  @JoinColumn()
  uploader: User;

  @ManyToOne(() => Folder, (folder) => folder.files, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  folder: Folder;
}
