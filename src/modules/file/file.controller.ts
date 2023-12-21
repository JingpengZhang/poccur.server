import { Body, Controller, Post, Req, UsePipes } from '@nestjs/common';
import { FileService } from './file.service';
import { FastifyRequest } from 'fastify';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { deleteDocsJoi } from '../../common/joi/delete-docs.joi';
import { DeleteDocsDto } from '../../common/dto/delete-docs.dto';

@Controller('file')
export class FileController {
  constructor(private readonly service: FileService) {}

  @Post('upload')
  async upload(@Req() request: FastifyRequest) {
    const data = await request.file();
    return {
      info: await this.service.saveFile(data, request['user'].id),
    };
  }

  @Post('upload-multiple')
  async uploadMultiple(@Req() request: FastifyRequest) {
    console.log(request);
    const files = request.files();
    return {
      info: await this.service.saveFiles(files, request['user'].id),
    };
  }

  @Post('delete')
  @UsePipes(new JoiValidationPipe(deleteDocsJoi))
  async delete(@Body() body: DeleteDocsDto) {
    return {
      deleteCount: await this.service.delete(body),
    };
  }
}
