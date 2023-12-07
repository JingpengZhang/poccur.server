import { BadRequestException, HttpException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

// * 从 query 中提取 GetListDto
export const distillGetListDto = (query: PageQuery): GetListDto => {
  const { page, pageCount } = query;
  let _page = page | 1,
    _pageCount = pageCount | 10;

  return {
    skip: (_page - 1) * _pageCount,
    limit: _pageCount,
  };
};

// * 检查id是否有效
export const isIdValid = (id: any): ServiceResult<null> => {
  let result = false;
  result = /^[0-9a-fA-F]{24}$/.test(id);
  if (result) result = Types.ObjectId.isValid(id);
  return {
    result: result,
    message: result ? 'id 有效' : 'id 无效',
  };
};

// * 检查id是否存在
export const isIdExist = async <T>(
  model: Model<T>,
  id: string,
): Promise<ServiceResult<null>> => {
  const isExist = await model.exists({ _id: id });
  return {
    result: isExist ? true : false,
    message: isExist ? 'id 存在' : 'id 不存在',
  };
};

export const mongooseErrorHandle = (err: any) => {
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue)[0];
    throw new BadRequestException({
      message: `字段 ${duplicateField} 重复`,
    });
  } else if (err.path && err.path === '_id') {
    throw new NotFoundException();
  } else {
    throw new BadRequestException('未知错误,请稍后再试');
  }
};


export default {
  distillGetListDto,
  isIdValid,
  isIdExist,
  mongooseErrorHandle,
};
