import { MultipartFile } from '@fastify/multipart';

export interface UserUpdateAvatarDto {
  uploaderId: number;
  file: MultipartFile;
}
