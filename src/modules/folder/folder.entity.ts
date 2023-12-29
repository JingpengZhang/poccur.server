import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../user/user.entity';
import { File } from '../file/file.entity';

@Entity()
export class Folder extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => User, (user) => user.folders, { onDelete: 'CASCADE' })
  creator: User;

  @ManyToOne(() => Folder, (folder) => folder.children, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  parent: Folder;

  @OneToMany(() => Folder, (folder) => folder.parent)
  children: Folder[];

  @OneToMany(() => File, (file) => file.folder)
  files: File[];
}
