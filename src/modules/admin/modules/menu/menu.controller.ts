import { Body, Controller, Get, NotFoundException, Post, Query, UsePipes } from '@nestjs/common';
import { MenuService } from './menu.service';
import {
  CreateMenuDto,
  createMenuSchema,
  DeleteDto,
  deleteSchema,
  GetOneByIdDto,
  getOneByIdSchema,
  UpdateMenuDto,
  updateMenuSchema,
} from './menu.dto';
import { JoiValidationPipe } from 'src/pipes/joi-validation.pipe';
import { GetListSchema } from '../../../../common/common.schema';
import { GetListPipe } from '../../../../pipes/get-list.pipe';

@Controller('/admin/menu')
export class MenuController {
  constructor(private readonly service: MenuService) {
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

  @Post('create')
  @UsePipes(new JoiValidationPipe(createMenuSchema))
  async create(@Body() body: CreateMenuDto) {
    await this.service.create(body);
    return;
  }

  @Post('update')
  @UsePipes(new JoiValidationPipe(updateMenuSchema))
  async update(@Body() body: UpdateMenuDto) {
    await this.service.update(body);
    return;
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
}
