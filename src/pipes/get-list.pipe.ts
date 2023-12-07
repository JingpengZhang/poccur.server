import { Injectable, PipeTransform } from '@nestjs/common';
import { QueryOptions } from 'mongoose';
import { GetListDto } from '../common/common.dto';

@Injectable()
export class GetListPipe implements PipeTransform {

  transform(value: GetListDto): QueryOptions {
    const { page, pageSize } = value;

    let _page = page || 1, _pageSize = pageSize || 10;


    return {
      skip: (_page - 1) * _pageSize,
      limit: _pageSize,
    };
  }
}