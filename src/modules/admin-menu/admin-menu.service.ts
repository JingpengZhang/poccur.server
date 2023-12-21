import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { AdminMenu } from 'src/modules/admin-menu/admin-menu.schema';
import ArrayUtils from '../../utils/array-utils';
import MongooseExceptions from '../../common/exceptions/MongooseExceptions';
import { AdminMenuCreateDto } from './dto/admin-menu.create.dto';
import { AdminMenuUpdateDto } from './dto/admin-menu.update.dto';
import { DeleteDocsDto } from '../../common/dto/delete-docs.dto';
import { AdminMenuUpdateIndexesDto } from './dto/admin-menu.update-indexes.dto';

@Injectable()
export class AdminMenuService {
  constructor(
    @InjectModel(AdminMenu.name) private menuModel: Model<AdminMenu>,
  ) {}

  async create(createDto: AdminMenuCreateDto) {
    // 父菜单是否存在
    if (createDto.parent) {
      const parent = await this.menuModel.exists({ _id: createDto.parent });
      if (!parent) throw new BadRequestException('添加失败,父菜单不存在');
    }

    // 构造索引
    const brothers = (await this.menuModel.find({
      parent: createDto.parent,
    })) as AdminMenu[];
    const createMenu = new this.menuModel({
      ...createDto,
      index: brothers.length + 1,
    });

    try {
      await createMenu.save();
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  async update(updateDto: AdminMenuUpdateDto) {
    try {
      const { id, ...params } = updateDto;

      return await this.menuModel.findByIdAndUpdate(updateDto.id, {
        ...params,
      });
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  async list(query: QueryOptions) {
    return this.menuModel.find({}, null, query);
  }

  async count() {
    return this.menuModel.countDocuments();
  }

  async getOneById(id: string) {
    try {
      const result = await this.menuModel.findById(id);
      if (result) {
        return {
          id: result._id,
          name: result.name,
          iconclass: result.iconclass,
          path: result.path,
        };
      } else {
        return null;
      }
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  async delete(deleteDto: DeleteDocsDto) {
    const { ids, all } = deleteDto;
    try {
      let toDeleteIds = [];
      if (all) {
        try {
          const allDoc = await this.menuModel.find({});
          allDoc.forEach((item) => {
            toDeleteIds.push(item._id);
          });
        } catch (err) {
          throw new MongooseExceptions(err);
        }
      } else {
        toDeleteIds = ids;
      }
      const result = await this.menuModel.deleteMany({
        _id: { $in: toDeleteIds },
      });
      return result.deletedCount;
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  async getMenuTree() {
    const menus = await this.list({});

    let removeVMenus: AdminMenu[] = [];
    // 剔除 __v 属性
    menus.forEach((item) => {
      const { __v, _id, ...menu } = item['_doc'];
      menu.id = _id;
      removeVMenus.push(menu);
    });

    const groupedAndSortedMenus = ArrayUtils.groupAndSort(
      removeVMenus,
      'parent',
      'index',
    );

    return ArrayUtils.generateTree(groupedAndSortedMenus, {
      indexKey: 'parent',
      rootVal: null,
      parentBy: 'id',
    });
  }

  async setMenuIndexes(body: AdminMenuUpdateIndexesDto) {
    for (let i = 0; i < body.indexes.length; i++) {
      let item = body.indexes[i];
      try {
        await this.menuModel.updateOne(
          { _id: item.id },
          {
            index: item.index,
            parent: item.parent,
          },
        );
      } catch (err) {}
    }
  }
}
