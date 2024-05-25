import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { Stream } from 'stream';

export class UploadFilesDto {
  @IsNumber()
  @IsNotEmpty()
  folder_id: { value: string };

  @IsArray()
  @IsNotEmpty()
  files: FormDataFile[];
}
