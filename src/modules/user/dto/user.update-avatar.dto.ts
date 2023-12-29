import { MultipartFile } from '@fastify/multipart';
import { File } from 'formidable';

export interface UserUpdateAvatarDto {
  uploaderId: number;
  file: File;
}
