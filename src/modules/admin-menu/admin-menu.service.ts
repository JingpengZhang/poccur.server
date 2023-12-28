import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminMenuCreateDto } from './dto/admin-menu.create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminMenu } from './admin-menu.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { GenericService } from '../../common/services/generic.service';
import { QueryFailedExceptions } from '../../common/exceptions/query-failed-exceptions';
import { AdminMenuUpdateTreeDto } from './dto/admin-menu.update-tree.dto';
import { AdminMenuUpdateDto } from './dto/admin-menu.update.dto';
import { ListDto } from '../../common/dto/list.dto';

@Injectable()
export class AdminMenuService extends GenericService<AdminMenu> {
  constructor(
    @InjectRepository(AdminMenu) private repository: Repository<AdminMenu>,
  ) {
    super(repository);
  }

  async create(dto: AdminMenuCreateDto) {
    const { parent, ...rest } = dto;

    // get parent
    const parentMenu = await this.repository.findOne({
      where: {
        id: parent,
      },
      relations: {
        children: true,
      },
    });

    // generate index
    let index = 1;
    if (parentMenu) {
      index = parentMenu.children.length + 1;
    } else {
      index =
        (
          await this.repository.find({
            where: {
              parent: IsNull(),
            },
          })
        ).length + 1;
    }

    // generate AdminMenu
    const adminMenu = new AdminMenu();
    adminMenu.index = index;
    if (parentMenu) adminMenu.parent = parentMenu;
    Object.assign(adminMenu, rest);

    try {
      return await this.repository.save(adminMenu);
    } catch (err) {
      throw new QueryFailedExceptions(err);
    }
  }

  async updateTree(dto: AdminMenuUpdateTreeDto) {
    for await (const item of dto.indexes) {
      const menu = await this.repository.findOneBy({ id: item.id });
      if (menu) menu.index = item.index;
      menu.parent = await this.repository.findOneBy({ id: item.parent });
      await this.repository.save(menu);
    }
    return;
  }

  async update(updateDto: AdminMenuUpdateDto) {
    const { id, parent, ...rest } = updateDto;

    const menuItem = await this.repository.findOneBy({ id });

    if (!menuItem) throw new BadRequestException('待修改菜单不存在');

    // find to parent
    const parentMenu = await this.repository.findOne({
      where: { id: parent },
      relations: {
        children: true,
      },
    });
    menuItem.parent = parentMenu;

    if (parentMenu) {
      if (parentMenu.children.find((item) => item.id === menuItem.id)) {
        menuItem.index = parentMenu.children.length;
      } else {
        menuItem.index = parentMenu.children.length + 1;
      }
    } else {
      menuItem.index =
        (
          await this.repository.find({
            where: {
              parent: IsNull(),
              id: Not(menuItem.id),
            },
          })
        ).length + 1;
    }

    Object.assign(menuItem, rest);

    await this.repository.save(menuItem);
  }

  async tree() {
    return await this.repository.find({
      relations: {
        children: true,
      },
      order: { index: 'ASC' },
    });
  }
}
