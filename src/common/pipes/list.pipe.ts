import { Injectable, PipeTransform } from '@nestjs/common';
import { QueryOptions } from 'mongoose';

@Injectable()
export class GetListPipe implements PipeTransform {
  transform(value: { page: number; pageSize: number }): QueryOptions {
    const { page, pageSize } = value;

    let _page = page || 1,
      _pageSize = pageSize || 10;

    return {
      skip: (_page - 1) * _pageSize,
      take: _pageSize,
    };
  }
}
