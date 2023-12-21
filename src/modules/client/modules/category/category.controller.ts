import { Body, Controller, Get, NotFoundException, Post, Query, Req, UsePipes } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, DeleteCategoryDto, UpdateCategoryDto } from './category.dto';
import { JoiValidationPipe } from '../../../../pipes/joi-validation.pipe';
import { createCategorySchema, deleteCategorySchema, updateCategorySchema } from './category.schema';
import { GetListSchema } from '../../../../common/common.schema';
import { GetListPipe } from '../../../../pipes/get-list.pipe';
import { FastifyRequest } from 'fastify';
import { Public } from '../../../../decorators/public.decorator';
import { Roles } from '../../../../decorators/role.decorator';
import { Role } from '../../../auth/role.enum';

@Controller('/client/category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {
  }

  @Post('create')
  @Roles(Role.Super,Role.Admin)
  @UsePipes(new JoiValidationPipe(createCategorySchema))
  async create(@Req() request: FastifyRequest, @Body() body: CreateCategoryDto) {
    await this.service.create(body);
    return;
  }

  @Post('update')
  @Roles(Role.Super,Role.Admin)
  @UsePipes(new JoiValidationPipe(updateCategorySchema))
  async update(@Body() body: UpdateCategoryDto) {
    const result = await this.service.update(body);
    if (!result) throw new NotFoundException('待修改ID不存在');
  }

  @Get('list')
  @Public()
  @UsePipes(new JoiValidationPipe(GetListSchema))
  async getList(@Query(new GetListPipe()) query: GetListDto) {
    const list = await this.service.getList(query);
    const total = await this.service.getCount();
    return {
      list,
      total,
    };
  }

  // * 删除分类(提供单个和批量)
  @Post('delete')
  @Roles(Role.Super,Role.Admin)
  @UsePipes(new JoiValidationPipe(deleteCategorySchema))
  async delete(@Body() body: DeleteCategoryDto) {
    return {
      deleteCount: await this.service.delete(body),
    };
  }
}
