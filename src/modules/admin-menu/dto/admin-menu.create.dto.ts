export interface AdminMenuCreateDto {
  name: string;
  path: string;
  icon: string;
  parent: string;
  enable: boolean;
  visible: boolean;
}
