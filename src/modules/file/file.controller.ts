import { Body, Controller, Post, Req } from '@nestjs/common';
import { FileService } from './file.service';
import { FastifyRequest } from 'fastify';
import { Public } from '../../decorators/public.decorator';

@Controller('/file')
export class FileController {
  constructor(private readonly service: FileService) {
  }

  @Post('/upload')
  async upload(@Req() request: FastifyRequest) {
    const data = await request.file();
    return {
      info: await this.service.saveFile(data, request['user'].id),
    };
  }

  @Post('/upload-multiple')
  async uploadMultiple(@Req() request: FastifyRequest) {
    console.log(request);
    const files = request.files();
    return {
      info: await this.service.saveFiles(files, request['user'].id),
    };
  }

}