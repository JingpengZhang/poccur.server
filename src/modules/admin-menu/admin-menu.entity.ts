import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class AdminMenu extends BaseEntity {
  @Column()
  name: string;

  @Column()
  path: string;

  @Column({ default: '' })
  iconClass: string;

  @Column()
  index: number;

  @Column({ default: true })
  enable: boolean;

  @Column({ default: true })
  visible: boolean;

  @OneToMany(() => AdminMenu, (adminMenu) => adminMenu.parent)
  children: AdminMenu[];

  @ManyToOne(() => AdminMenu, (adminMenu) => adminMenu.children, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  parent: AdminMenu;
}
