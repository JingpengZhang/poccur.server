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

export interface FindOneUserByIdDto {
  id: string;
}

export interface UpdateUserDto {
  id: string,
  username?: string;
  roles?: string;
  description?: string;
  career?: string;
}