import { MultipartFile } from '@fastify/multipart';

export interface UserUpdateAvatarDto {
  uploaderId: string;
  file: MultipartFile;
}
