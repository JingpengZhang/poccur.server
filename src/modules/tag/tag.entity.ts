import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';

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
}
