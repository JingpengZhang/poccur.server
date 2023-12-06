import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import serviceUtils from 'src/libs/serviceUtils';
import { Category } from 'src/schemas/category.schema';

@Controller('/blog/category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  // * 添加分类
  @Post('create')
  async create(@Body() body: CreateCategoryDto): Promise<ResponseData> {
    const createResult = await this.service.create(body);

    return {
      code: createResult.result ? 200 : 1000,
      message: createResult.message,
    };
  }

  // * 获取分类列表
  @Get('list')
  async getList(
    @Query() query: PageQuery,
  ): Promise<ResponseListData<Category>> {
    const categories = await this.service.getList(
      serviceUtils.distillGetListDto(query),
    );
    return {
      code: 200,
      message: '操作成功',
      data: categories,
    };
  }

  // * 修改分类数据
  @Post('update')
  async update(@Body() body: UpdateCategoryDto): Promise<ResponseData> {
    const result = await this.service.update(body);
    return {
      code: result.result ? 200 : 1000,
      message: result.message,
    };
  }

  // * 删除分类(提供单个和批量)
  @Delete('delete')
  async delete(@Body() body: { params: string | string[] }) {
    const result = await this.service.delete(body.params);
    return {
      code: result.result ? 200 : 1000,
      data: result.data,
      message: result.message,
    };
  }
}
