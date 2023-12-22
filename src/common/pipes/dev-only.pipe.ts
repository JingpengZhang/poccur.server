import {
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import * as process from 'process';

@Injectable()
export class DevOnlyPipe implements PipeTransform {
  transform(value: any): any {
    const isDevEnvironment = process.env.NODE_ENV === 'dev';
    if (!isDevEnvironment) {
      throw new UnauthorizedException('该接口仅开发时可用');
    }
    return value;
  }
}
