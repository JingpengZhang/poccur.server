import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: Record<string, any>, meta: ArgumentMetadata) {
    if (meta.type === 'body') {
      if (isUndefined(value)) {
        throw new BadRequestException({
          message: '缺少参数',
        });
      }
      const { error } = this.schema.validate(value);
      if (error) {
        throw new BadRequestException({
          message: error.message.replace(/(\"|\[\d\])/g, ''),
        });
      }
    }

    return value;
  }
}
