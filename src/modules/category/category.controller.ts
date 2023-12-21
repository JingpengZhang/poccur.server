import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { GetListPipe } from '../../common/pipes/get-list.pipe';
import { FastifyRequest } from 'fastify';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/role.decorator';
import { Role } from '../../constants/role.enum';
import { categoryCreateJoi } from './joi/category.create.joi';
import { CategoryCreateDto } from './dto/category.create.dto';
import { categoryUpdateJoi } from './joi/category.update.joi';
import { CategoryUpdateDto } from './dto/category.update.dto';
import { getListJoi } from '../../common/joi/get-list.joi';
import { deleteDocsJoi } from '../../common/joi/delete-docs.joi';
import { DeleteDocsDto } from '../../common/dto/delete-docs.dto';
import { DocsListDto } from '../../common/dto/docs-list.dto';

@Controller('/client/category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post('create')
  @Roles(Role.Super, Role.Admin)
  @UsePipes(new JoiValidationPipe(categoryCreateJoi))
  async create(
    @Req() request: FastifyRequest,
    @Body() body: CategoryCreateDto,
  ) {
    await this.service.create(body);
    return;
  }

  @Post('update')
  @Roles(Role.Super, Role.Admin)
  @UsePipes(new JoiValidationPipe(categoryUpdateJoi))
  async update(@Body() body: CategoryUpdateDto) {
    const result = await this.service.update(body);
    if (!result) throw new NotFoundException('待修改ID不存在');
  }

  @Get('list')
  @Public()
  @UsePipes(new JoiValidationPipe(getListJoi))
  async getList(@Query(new GetListPipe()) query: DocsListDto) {
    const list = await this.service.getList(query);
    const total = await this.service.getCount();
    return {
      list,
      total,
    };
  }

  // * 删除分类(提供单个和批量)
  @Post('delete')
  @Roles(Role.Super, Role.Admin)
  @UsePipes(new JoiValidationPipe(deleteDocsJoi))
  async delete(@Body() body: DeleteDocsDto) {
    return {
      deleteCount: await this.service.delete(body),
    };
  }
}
