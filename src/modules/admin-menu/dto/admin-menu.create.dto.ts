export interface AdminMenuCreateDto {
  name: string;
  path: string;
  iconClass: string;
  parent: number;
  enable: boolean;
  visible: boolean;
}
