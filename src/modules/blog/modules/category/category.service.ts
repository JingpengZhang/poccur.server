import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/schemas/category.schema';
import { Model } from 'mongoose';
import serviceUtils from 'src/libs/serviceUtils';
import { Types } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  // * 检查分类名是否存在
  async nameExists(name: Category['name']): Promise<ServiceResult<null>> {
    const exists = await this.categoryModel.exists({
      name: name,
    });
    if (exists) {
      return {
        result: true,
        message: '分类名称重复',
      };
    } else {
      return {
        result: false,
        message: '不存在',
      };
    }
  }

  // * 检查分类别名是否存在
  async aliasExists(alias: Category['alias']): Promise<ServiceResult<null>> {
    const exists = await this.categoryModel.exists({
      alias: alias,
    });
    if (exists) {
      return {
        result: true,
        message: '分类别名重复',
      };
    } else {
      return {
        result: false,
        message: '不存在',
      };
    }
  }

  // * 创建分类
  async create(createDto: CreateCategoryDto): Promise<ServiceResult<Category>> {
    // ? 检查分类名是否存在
    const nameExists = await this.nameExists(createDto.name);
    if (nameExists.result)
      return {
        result: false,
        message: '添加失败,' + nameExists.message,
      };

    // ? 检查分类别名是否存在
    const aliasExists = await this.aliasExists(createDto.alias);
    if (aliasExists.result)
      return {
        result: false,
        message: '添加失败,' + aliasExists.message,
      };

    const createCategory = new this.categoryModel(createDto);
    const category = await createCategory.save();
    return {
      result: true,
      data: category,
      message: '操作成功',
    };
  }

  // * 获取分类列表
  async getList(getListDto: GetListDto): Promise<Category[]> {
    return await this.categoryModel.find({}, null, {
      skip: getListDto.skip,
      limit: getListDto.limit,
    });
  }

  // * 修改分类数据
  async update(updateDto: UpdateCategoryDto): Promise<ServiceResult<null>> {
    const { id, name, alias, description } = updateDto;
    // ? 验证id是否有效
    const isIdValid = serviceUtils.isIdValid(id);
    if (!isIdValid.result)
      return { ...isIdValid, message: '操作失败,' + isIdValid.message };

    // * 有效
    // ? 检查分类 id 是否存在
    const category = await this.categoryModel.exists({ _id: id });
    // * 存在
    if (category) {
      // ? 检查分类名称是否存在
      const nameExist = await this.nameExists(name);
      if (!nameExist.result) {
        // ? 检查分类别名是否存在
        const aliasExist = await this.aliasExists(alias);
        if (!aliasExist.result) {
          // * 都不存在,修改数据
          const updatedCategory = await this.categoryModel.updateOne(
            { _id: id },
            {
              name,
              alias,
              description,
            },
          );
          if (updatedCategory) {
            return {
              result: true,
              message: '修改成功',
            };
          } else {
            return {
              result: false,
              message: '操作失败,未知错误',
            };
          }
        } else {
          return {
            result: false,
            message: '修改失败,' + aliasExist.message,
          };
        }
      } else {
        return {
          result: false,
          message: '修改失败,' + nameExist.message,
        };
      }
    }
  }

  // * 删除分类(提供单个和批量)
  async delete(input: string[] | string): Promise<ServiceResult<any>> {
    if (input instanceof Array) {
      let invalidIds: string[] = [];
      let notExistIds: string[] = [];

      let toDeleteIds: string[] = [];

      for (let i = 0; i < input.length; i++) {
        const id = input[i];
        const isIdValid = serviceUtils.isIdValid(id);
        if (!isIdValid.result) {
          invalidIds.push(id);
          continue;
        }
        const isIdExist = await serviceUtils.isIdExist(this.categoryModel, id);
        if (!isIdExist.result) {
          notExistIds.push(id);
          continue;
        }
        toDeleteIds.push(id);
      }

      const result = await this.categoryModel.deleteMany({
        _id: { $in: toDeleteIds },
      });

      return {
        result: true,
        data: {
          invalidIds,
          notExistIds,
          deletedIds: toDeleteIds,
        },
        message:
          toDeleteIds.length !== 0
            ? result.deletedCount === toDeleteIds.length
              ? '删除成功'
              : '操作成功,但有提供的 id 未成功删除.'
            : '未删除任何数据',
      };
    } else {
      const isIdValid = serviceUtils.isIdValid(input);
      if (!isIdValid.result)
        return { ...isIdValid, message: '操作失败,' + isIdValid.message };
      const isIdExist = await serviceUtils.isIdExist(this.categoryModel, input);
      if (!isIdExist.result)
        return { ...isIdExist, message: '操作失败,' + isIdExist.message };
      const result = await this.categoryModel.deleteOne({ _id: input });
      if (result.deletedCount === 1) {
        return {
          result: true,
          message: '删除成功',
        };
      } else {
        return {
          result: false,
          message: '删除失败,未知原因',
        };
      }
    }
  }
}
