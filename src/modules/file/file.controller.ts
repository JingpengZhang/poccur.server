import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FastifyRequest } from 'fastify';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { ListDto } from '../../common/dto/list.dto';
import { DeleteQueryDto } from '../../common/dto/delete-query.dto';
import { deleteQueryJoi } from '../../common/joi/delete-query.joi';
import { DevOnlyPipe } from '../../common/pipes/dev-only.pipe';
import { Public } from '../../common/decorators/public.decorator';

@Controller('file')
export class FileController {
  constructor(private readonly service: FileService) {}

  @Post('upload')
  @Public()
  async upload(@Req() request: FastifyRequest) {
    const data = await request.file();
    // request['user'].id
    return {
      info: await this.service.saveFile(data, 6),
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
  @UsePipes(new JoiValidationPipe(deleteQueryJoi))
  async delete(@Body() body: DeleteQueryDto) {
    return await this.service.deleteFiles(body);
  }

  @Post('delete_all')
  @Public()
  @UsePipes(new DevOnlyPipe())
  async deleteAll() {
    return await this.service.deleteAllFiles();
  }

  @Get('list')
  async listWithUploader(@Query() query: ListDto) {
    return await this.service.getList(query);
  }
}
