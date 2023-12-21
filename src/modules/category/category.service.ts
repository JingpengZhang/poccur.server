import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/modules/category/category.schema';
import { Model, QueryOptions } from 'mongoose';
import MongooseExceptions from '../../common/exceptions/MongooseExceptions';
import { CategoryCreateDto } from './dto/category.create.dto';
import { CategoryUpdateDto } from './dto/category.update.dto';
import { DeleteDocsDto } from '../../common/dto/delete-docs.dto';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private model: Model<Category>) {}

  // * 创建分类
  async create(createDto: CategoryCreateDto) {
    try {
      const createCategory = new this.model(createDto);
      await createCategory.save();
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  // * 修改分类数据
  async update(updateDto: CategoryUpdateDto) {
    const { id, ...params } = updateDto;

    try {
      return await this.model.findByIdAndUpdate(id, { ...params });
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  // * 获取分类列表
  async getList(query: QueryOptions) {
    try {
      const queryResult = await this.model.find({}, null, query);
      let result = [];
      queryResult.forEach((item) => {
        const { _id, __v, ...rest } = item['_doc'];
        result.push({
          id: _id,
          ...rest,
        });
      });
      return result;
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }

  async getCount() {
    return this.model.countDocuments();
  }

  async delete(deleteDto: DeleteDocsDto) {
    const { ids, all } = deleteDto;
    try {
      let toDeleteIds = [];

      if (all) {
        try {
          const allDoc = await this.model.find({});
          allDoc.forEach((item) => {
            toDeleteIds.push(item._id);
          });
        } catch (err) {
          throw new MongooseExceptions(err);
        }
      } else {
        toDeleteIds = ids;
      }
      const result = await this.model.deleteMany({ _id: { $in: toDeleteIds } });
      return result.deletedCount;
    } catch (err) {
      throw new MongooseExceptions(err);
    }
  }
}
