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
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('file')
export class FileController {
  constructor(private readonly service: FileService) {}

  // 上传文件（可同时上传多个）
  @Post('upload')
  async upload(@CurrentUser() userId: number, @Req() request: FastifyRequest) {
    await this.service.uploadFiles(userId, request.parts());
  }

  @Post('delete')
  @UsePipes(new JoiValidationPipe(deleteQueryJoi))
  async delete(@Body() body: DeleteQueryDto) {
    return await this.service.deleteFiles(body);
  }

  @Post('delete_all')
  @UsePipes(new DevOnlyPipe())
  async deleteAll() {
    return await this.service.deleteAllFiles();
  }

  @Get('list')
  async listWithUploader(@Query() query: ListDto) {
    return await this.service.getList(query);
  }
}
