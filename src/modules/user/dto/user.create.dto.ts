import { Role } from '../../../constants/role.enum';

export interface UserCreateDto {
  email: string;
  password: string;
  username?: string;
  roles?: Role[];
}
