import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectIdColumn,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Role } from '../../constants/role.enum';
import { File } from '../file/file.entity';
import { Tag } from '../tag/tag.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column('json')
  roles: string[];

  @Column({
    default: '简单介绍一下自己吧~',
  })
  description: string;

  @Column({
    default: '',
  })
  career: string;

  @Column({
    default: '',
  })
  city: string;

  @Column({
    default: '',
  })
  company: string;

  @Column({
    default: '',
  })
  website: string;

  @OneToMany(() => File, (file) => file.uploader)
  files: File[];

  @OneToMany(() => Tag, (tag) => tag.creator)
  tags: Tag[];

  @ManyToOne(() => File, { onDelete: 'SET NULL' })
  @JoinColumn()
  avatar: File;
}
