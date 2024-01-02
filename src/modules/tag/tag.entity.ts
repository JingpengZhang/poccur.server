import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { Article } from '../article/article.entity';

@Entity()
export class Tag extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  alias: string;

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
  @JoinColumn()
  creator: User;

  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];
}
