import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../user/user.entity';
import { Article } from '../article/article.entity';
import { IconEntity } from 'src/common/entities/icon.entity';

@Entity()
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  alias: string;

  @Column({ default: '' })
  description: string;

  @Column(() => IconEntity)
  icon: IconEntity;

  @ManyToOne(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
  @JoinColumn()
  creator: User;

  @ManyToMany(() => Article, (article) => article.categories)
  articles: Article[];
}
