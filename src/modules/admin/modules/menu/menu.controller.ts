import { Body, Controller, Get, NotFoundException, Post, Query, UsePipes } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto, DeleteDto, GetOneByIdDto, UpdateIndexesDto, UpdateMenuDto } from './menu.dto';
import { JoiValidationPipe } from 'src/pipes/joi-validation.pipe';
import { GetListSchema } from '../../../../common/common.schema';
import { GetListPipe } from '../../../../pipes/get-list.pipe';
import { createMenuSchema, deleteSchema, getOneByIdSchema, updateIndexesSchema, updateMenuSchema } from './menu.schema';
import { Public } from '../../../../decorators/public.decorator';

@Controller('/admin/menu')
export class MenuController {
  constructor(private readonly service: MenuService) {
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

  @Post('create')
  @UsePipes(new JoiValidationPipe(createMenuSchema))
  async create(@Body() body: CreateMenuDto) {
    await this.service.create(body);
    return;
  }

  @Post('update')
  @UsePipes(new JoiValidationPipe(updateMenuSchema))
  async update(@Body() body: UpdateMenuDto) {
    const result = await this.service.update(body);
    if (!result) throw new NotFoundException('待修改ID不存在');
    return {
      message: '修改成功',
    };
  }

  @Get('count')
  async getCount() {
    return await this.service.getCount();
  }

  @Get('get_by_id')
  @UsePipes(new JoiValidationPipe(getOneByIdSchema))
  async getOneById(@Query() body: GetOneByIdDto) {
    const result = await this.service.getOneById(body.id);
    if (!result) throw  new NotFoundException();
    return result;
  }

  @Post('delete')
  @UsePipes(new JoiValidationPipe(deleteSchema))
  async delete(@Body() body: DeleteDto) {
    return {
      deleteCount: await this.service.delete(body),
    };
  }

  @Get('tree')
  async getMenuTree() {
    return {
      menuTree: await this.service.getMenuTree(),
    };
  }

  @Post('update_index')
  @UsePipes(new JoiValidationPipe(updateIndexesSchema))
  async setMenuIndexes(@Body() body: UpdateIndexesDto) {
    await this.service.setMenuIndexes(body);
    return;
  }
}
