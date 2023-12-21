import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { AdminMenuService } from './admin-menu.service';
import { AdminMenuCreateDto } from './dto/admin-menu.create.dto';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import { GetListPipe } from '../../common/pipes/get-list.pipe';
import { Public } from '../../common/decorators/public.decorator';
import { getListJoi } from '../../common/joi/get-list.joi';
import { AdminMenuUpdateDto } from './dto/admin-menu.update.dto';
import { DocsListDto } from '../../common/dto/docs-list.dto';
import { adminMenuCreateJoi } from './joi/admin-menu.create.joi';
import { adminMenuUpdateJoi } from './joi/admin-menu.update.joi';
import { Roles } from '../../common/decorators/role.decorator';
import { Role } from '../../constants/role.enum';
import { deleteDocsJoi } from '../../common/joi/delete-docs.joi';
import { DeleteDocsDto } from '../../common/dto/delete-docs.dto';
import { AdminMenuUpdateIndexesDto } from './dto/admin-menu.update-indexes.dto';
import { adminMenuUpdateIndexesJoi } from './joi/admin-menu.update-indexes.joi';

@Controller('/admin/menu')
export class AdminMenuController {
  constructor(private readonly service: AdminMenuService) {}

  @Get('list')
  @Public()
  @UsePipes(new JoiValidationPipe(getListJoi))
  async list(@Query(new GetListPipe()) query: DocsListDto) {
    return {
      list: await this.service.list(query),
      total: await this.service.count(),
    };
  }

  @Post('create')
  @UsePipes(new JoiValidationPipe(adminMenuCreateJoi))
  async create(@Body() body: AdminMenuCreateDto) {
    await this.service.create(body);
    return;
  }

  @Post('update')
  @UsePipes(new JoiValidationPipe(adminMenuUpdateJoi))
  async update(@Body() body: AdminMenuUpdateDto) {
    const result = await this.service.update(body);
    if (!result) throw new NotFoundException('待修改ID不存在');
    return {
      message: '修改成功',
    };
  }

  @Post('delete')
  @Roles(Role.Super)
  @UsePipes(new JoiValidationPipe(deleteDocsJoi))
  async delete(@Body() body: DeleteDocsDto) {
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
  @UsePipes(new JoiValidationPipe(adminMenuUpdateIndexesJoi))
  async setMenuIndexes(@Body() body: AdminMenuUpdateIndexesDto) {
    await this.service.setMenuIndexes(body);
    return;
  }
}
