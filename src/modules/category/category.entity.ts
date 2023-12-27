import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../user/user.entity';

@Entity()
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  alias: string;

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
  @JoinColumn()
  creator: User;
}
