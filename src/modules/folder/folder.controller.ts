import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderCreateDto } from './dto/folder.create.dto';
import { FastifyRequest } from 'fastify';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { folderCreateJoi } from './joi/folder.create.joi';
import { deleteQueryJoi } from '../../common/joi/delete-query.joi';
import { DeleteQueryDto } from '../../common/dto/delete-query.dto';
import { DevOnlyPipe } from '../../common/pipes/dev-only.pipe';
import { folderUpdateJoi } from './joi/folder.update.joi';
import { FolderUpdateDto } from './dto/folder.update.dto';
import { idJoi } from '../../common/joi/id.joi';
import { EntityIdDto } from '../../common/dto/entity-id.dto';

@Controller('folder')
export class FolderController {
  constructor(private readonly service: FolderService) {}

  @Post('create')
  @UsePipes(new JoiValidationPipe(folderCreateJoi))
  async create(@Req() request: FastifyRequest, @Body() body: FolderCreateDto) {
    return {
      id: (await this.service.create(request['user'].id, body)).id,
    };
  }

  @Post('delete')
  @UsePipes(new JoiValidationPipe(deleteQueryJoi))
  async delete(@Body() body: DeleteQueryDto) {
    return await this.service.delete(body.data);
  }

  @Post('delete_all')
  @UsePipes(new DevOnlyPipe())
  async deleteAll() {
    return await this.service.deleteAll();
  }

  @Post('update')
  @UsePipes(new JoiValidationPipe(folderUpdateJoi))
  async update(@Body() body: FolderUpdateDto) {
    await this.service.update(body);
    return;
  }

  @Get('get_children')
  @UsePipes(new JoiValidationPipe(idJoi))
  async getChildren(@Query() query: EntityIdDto) {
    return {
      list: await this.service.getChildren(query),
    };
  }
}
