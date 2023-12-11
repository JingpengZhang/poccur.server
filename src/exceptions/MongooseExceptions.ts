import { BadRequestException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

class MongooseExceptions extends HttpException {
  constructor(err: any) {

    let message = '未知错误,请稍后再试';
    let exceptionCode = HttpStatus.BAD_REQUEST;

    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyValue)[0];
      message = `字段 ${duplicateField} 重复`;
      exceptionCode = HttpStatus.CONFLICT;
    } else if (err.path && err.path === '_id') {
      throw new NotFoundException();
    }
    
    super({ message }, exceptionCode);
  }
}

export default MongooseExceptions;