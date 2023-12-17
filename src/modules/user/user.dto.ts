import { Role } from '../auth/role.enum';
import { MultipartFile } from '@fastify/multipart';

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
  roles?: Role[];
  description?: string;
  career?: string;
  city?: string
  company?: string
  website?: string
}

export interface UpdateAvatarDto {
  uploaderId: string;
  file: MultipartFile;
}