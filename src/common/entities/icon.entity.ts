import { Column } from 'typeorm';

export type Icon = {
  iconName?: string;
  iconColor?: string;
  iconSize?: number;
  iconType?: 'solid' | 'outline' | 'mini' | 'micro';
  iconStrokeWidth?: number;
};

export class IconEntity {
  // 名称
  @Column({
    default: 'tag',
  })
  name: string;

  // 颜色
  @Column({
    default: '#333',
  })
  color: string;

  // 大小
  @Column({
    default: 16,
  })
  size: number;

  // 厚度
  @Column({
    default: 1.5,
  })
  strokeWidth: number;
}
