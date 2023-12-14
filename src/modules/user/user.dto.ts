import { Role } from '../auth/role.enum';

export interface CreateUserDto {
  email: string;
  password: string;
  username?: string;
  roles?: Role[];
}

export interface FindOneUserByEmailDto {
  email: string;
}