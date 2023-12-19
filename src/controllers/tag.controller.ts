import { Body, Controller, Get, Post, Query, Req, UsePipes } from '@nestjs/common';
import { TagService } from '../services/tag.service';
import { Public } from '../decorators/public.decorator';
import { CreateTagDto, UpdateTagDto } from '../dto/tag.dto';
import { JoiValidationPipe } from '../pipes/joi-validation.pipe';
import { createTagSchema, updateTagSchema } from '../joi-schema/tag.joi.schema';
import { FastifyRequest } from 'fastify';
import { DeleteDocsDto, DocsListDto } from '../dto/common.dto';
import { deleteDocsJoiSchema } from '../joi-schema/common.joi.schema';
import { GetListPipe } from '../pipes/get-list.pipe';

@Controller('/tag')
export class TagController {
  constructor(private readonly service: TagService) {
  }

  @Post('create')
  @UsePipes(new JoiValidationPipe(createTagSchema))
  async create(@Req() request: FastifyRequest, @Body() body: Omit<CreateTagDto, 'creator'>) {
    return {
      id: await this.service.create({
        creator: request['user'].id,
        ...body,
      }),
    };
  }

  @Post('update')
  @UsePipes(new JoiValidationPipe(updateTagSchema))
  async update(@Body() body: UpdateTagDto) {
    await this.service.update(body);
    return;
  }

  @Post('delete')
  @UsePipes(new JoiValidationPipe(deleteDocsJoiSchema))
  async delete(@Body() body: DeleteDocsDto) {
    return {
      deleteCount: await this.service.delete(body),
    };
  }

  @Get('list')
  @Public()
  async list(@Query(new GetListPipe()) query: DocsListDto) {
    return {
      list: await this.service.list(query),
      total: await this.service.count(),
    };
  }
}