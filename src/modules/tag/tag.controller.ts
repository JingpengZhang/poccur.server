import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { Public } from '../../common/decorators/public.decorator';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { FastifyRequest } from 'fastify';
import { GetListPipe } from '../../common/pipes/get-list.pipe';
import { Roles } from '../../common/decorators/role.decorator';
import { Role } from '../../constants/role.enum';
import { tagCreateJoi } from './joi/tag.create.joi';
import { TagCreateDto } from './dto/tag.create.dto';
import { tagUpdateJoi } from './joi/tag.update.joi';
import { TagUpdateDto } from './dto/tag.update.dto';
import { deleteDocsJoi } from '../../common/joi/delete-docs.joi';
import { DeleteDocsDto } from '../../common/dto/delete-docs.dto';
import { getListJoi } from '../../common/joi/get-list.joi';
import { DocsListDto } from '../../common/dto/docs-list.dto';
import { DeleteDto } from '../../common/dto/delete.dto';
import { deleteQueryJoi } from '../../common/joi/delete-query.joi';
import { DeleteQueryDto } from '../../common/dto/delete-query.dto';
import { ListDto } from '../../common/dto/list.dto';
import { DevOnlyPipe } from '../../common/pipes/dev-only.pipe';

@Controller('/tag')
export class TagController {
  constructor(private readonly service: TagService) {}

  @Post('create')
  // @Roles(Role.Super, Role.Admin)
  @UsePipes(new JoiValidationPipe(tagCreateJoi))
  async create(
    @Req() request: FastifyRequest,
    @Body() body: Omit<TagCreateDto, 'creator'>,
  ) {
    const tag = await this.service.create({
      creator: request['user'].id,
      ...body,
    });
    return {
      id: tag.id,
    };
  }

  @Post('update')
  // @Roles(Role.Super, Role.Admin)
  @UsePipes(new JoiValidationPipe(tagUpdateJoi))
  async update(@Body() body: TagUpdateDto) {
    await this.service.update(body);
    return;
  }

  @Post('delete')
  // @Roles(Role.Super, Role.Admin)
  @UsePipes(new JoiValidationPipe(deleteQueryJoi))
  async delete(@Body() body: DeleteQueryDto) {
    return {
      deleteCount: await this.service.delete(body.data),
    };
  }

  @Post('delete_all')
  @Public()
  @UsePipes(new DevOnlyPipe())
  async deleteAll() {
    return await this.service.deleteAll();
  }

  @Get('list')
  @Public()
  @UsePipes(new JoiValidationPipe(getListJoi))
  async list(@Query() query: ListDto) {
    return {
      list: await this.service.list(query),
      total: await this.service.count(),
    };
  }
}
