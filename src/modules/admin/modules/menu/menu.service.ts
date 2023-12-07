import {
  Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { Menu } from 'src/schemas/menu.schema';
import { CreateMenuDto, DeleteDto, UpdateMenuDto } from './menu.dto';
import serviceUtils from 'src/libs/serviceUtils';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<Menu>) {
  }

  async create(createDto: CreateMenuDto) {
    const createMenu = new this.menuModel(createDto);

    try {
      await createMenu.save();
    } catch (err) {
      serviceUtils.mongooseErrorHandle(err);
    }
  }

  async update(updateDto: UpdateMenuDto) {
    try {
      const { id, ...params } = updateDto;

      const result = await this.menuModel.findByIdAndUpdate(updateDto.id, {
        ...params,
      });
    } catch (err) {
      serviceUtils.mongooseErrorHandle(err);
    }
  }

  async getList(query: QueryOptions) {
    return this.menuModel.find({}, null, query);
  }

  async getCount() {
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
      serviceUtils.mongooseErrorHandle(err);
    }
  }

  async delete(deleteDto: DeleteDto) {
    const { ids, all } = deleteDto;
    try {
      let toDeleteIds = [];
      if (all) {
        try {
          const allDoc = await this.menuModel.find({});
          allDoc.forEach(item => {
            toDeleteIds.push(item._id);
          });
        } catch (err) {
          serviceUtils.mongooseErrorHandle(err);
        }
      } else {
        toDeleteIds = ids;
      }
      const result = await this.menuModel.deleteMany({ _id: { $in: toDeleteIds } });
      return result.deletedCount;
    } catch (err) {
      serviceUtils.mongooseErrorHandle(err);
    }
  }
}
