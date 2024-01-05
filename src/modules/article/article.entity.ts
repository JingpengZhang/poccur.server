import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { Tag } from '../tag/tag.entity';
import { File } from '../file/file.entity';

@Entity()
export class Article extends BaseEntity {
  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  password: string;

  @Column({ default: true })
  public: boolean;

  @Column()
  path: string;

  @Column()
  storagePath: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.articles, { onDelete: 'SET NULL' })
  poster: User;

  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable()
  tags: Tag[];

  @ManyToMany(() => Category, (category) => category.articles)
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => File, { onDelete: 'SET NULL', nullable: true })
  cover: File;
}
