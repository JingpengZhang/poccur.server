import { Body, Controller, Delete, Get, NotFoundException, Post, Query, UsePipes } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, DeleteCategoryDto, UpdateCategoryDto } from './category.dto';
import { JoiValidationPipe } from '../../../../pipes/joi-validation.pipe';
import { createCategorySchema, deleteCategorySchema, updateCategorySchema } from './category.schema';
import { GetListSchema } from '../../../../common/common.schema';
import { GetListPipe } from '../../../../pipes/get-list.pipe';

@Controller('/blog/category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {
  }

  @Post('create')
  @UsePipes(new JoiValidationPipe(createCategorySchema))
  async create(@Body() body: CreateCategoryDto) {
    await this.service.create(body);
    return;
  }

  @Post('update')
  @UsePipes(new JoiValidationPipe(updateCategorySchema))
  async update(@Body() body: UpdateCategoryDto) {
    const result = await this.service.update(body);
    if (!result) throw new NotFoundException('待修改ID不存在');
  }

  @Get('list')
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
  @Delete('delete')
  @UsePipes(new JoiValidationPipe(deleteCategorySchema))
  async delete(@Body() body: DeleteCategoryDto) {
    return {
      deleteCount: await this.service.delete(body),
    };
  }
}
