import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

export class QueryFailedExceptions extends HttpException {
  constructor(err: any, msg?: string) {
    console.log('err', err);
    let message = '未知错误,请稍后再试';
    let exceptionCode = HttpStatus.BAD_REQUEST;

    if (err.code === 'ER_DUP_ENTRY') {
      message = msg || '字段重复';
    }

    super({ message }, exceptionCode);
  }
}
