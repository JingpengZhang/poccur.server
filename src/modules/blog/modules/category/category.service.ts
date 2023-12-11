import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/schemas/category.schema';
import { Model, QueryOptions } from 'mongoose';
import serviceUtils from 'src/libs/serviceUtils';
import { DeleteDto } from '../../../admin/modules/menu/menu.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private model: Model<Category>,
  ) {
  }

  // * 创建分类
  async create(createDto: CreateCategoryDto) {
    try {
      const createCategory = new this.model(createDto);
      await createCategory.save();
    } catch (err) {
      serviceUtils.mongooseErrorHandle(err);
    }
  }


  // * 修改分类数据
  async update(updateDto: UpdateCategoryDto) {
    const { id, ...params } = updateDto;

    try {
      return await this.model.findByIdAndUpdate(id, { ...params });
    } catch (err) {
      serviceUtils.mongooseErrorHandle(err);
    }
  }

  // * 获取分类列表
  async getList(query: QueryOptions) {
    return this.model.find({}, null, query);
  }

  async getCount() {
    return this.model.countDocuments();
  }

  async delete(deleteDto: DeleteDto) {
    const { ids, all } = deleteDto;
    try {
      let toDeleteIds = [];

      if (all) {
        try {
          const allDoc = await this.model.find({});
          allDoc.forEach(item => {
            toDeleteIds.push(item._id);
          });
        } catch (err) {
          serviceUtils.mongooseErrorHandle(err);
        }
      } else {
        toDeleteIds = ids;
      }
      const result = await this.model.deleteMany({ _id: { $in: toDeleteIds } });
      return result.deletedCount;
    } catch (err) {
      serviceUtils.mongooseErrorHandle(err);
    }
  }

}
