import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { AdminMenuService } from './admin-menu.service';
import { AdminMenuCreateDto } from './dto/admin-menu.create.dto';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import { adminMenuCreateJoi } from './joi/admin-menu.create.joi';
import { deleteQueryJoi } from '../../common/joi/delete-query.joi';
import { DeleteQueryDto } from '../../common/dto/delete-query.dto';
import { DevOnlyPipe } from '../../common/pipes/dev-only.pipe';
import { AdminMenuUpdateTreeDto } from './dto/admin-menu.update-tree.dto';
import { adminMenuUpdateTreeJoi } from './joi/admin-menu.update-tree.joi';
import { adminMenuUpdateJoi } from './joi/admin-menu.update.joi';
import { AdminMenuUpdateDto } from './dto/admin-menu.update.dto';

@Controller('/admin_menu')
export class AdminMenuController {
  constructor(private readonly service: AdminMenuService) {}

  @Post('create')
  @UsePipes(new JoiValidationPipe(adminMenuCreateJoi))
  async create(@Body() body: AdminMenuCreateDto) {
    await this.service.create(body);
    return;
  }

  @Post('delete')
  @UsePipes(new JoiValidationPipe(deleteQueryJoi))
  async delete(@Body() body: DeleteQueryDto) {
    return this.service.delete(body.data);
  }

  @Post('delete_all')
  @UsePipes(new DevOnlyPipe())
  async deleteAll() {
    return this.service.deleteAll();
  }

  @Post('update_tree')
  @UsePipes(new JoiValidationPipe(adminMenuUpdateTreeJoi))
  async updateTree(@Body() body: AdminMenuUpdateTreeDto) {
    await this.service.updateTree(body);
    return;
  }

  @Post('update')
  @UsePipes(new JoiValidationPipe(adminMenuUpdateJoi))
  async update(@Body() body: AdminMenuUpdateDto) {
    await this.service.update(body);
    return;
  }

  @Get('tree')
  async tree() {
    return await this.service.tree();
  }
}
