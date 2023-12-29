import { File } from 'formidable';

export interface CreateFileDto {
  file: File;
  uploaderId: number;
  filename?: string;
  folderId?: number;
  description?: string;
}
