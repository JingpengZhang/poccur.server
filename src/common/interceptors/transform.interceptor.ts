import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data !== undefined) {
          if (data instanceof Object) {
            const { message, ...restData } = data;

            const result: {
              code: number;
              message: string;
              data?: any;
            } = {
              code: 200,
              message: message || '请求成功',
            };

            if (Object.keys(restData).length !== 0) {
              result.data = restData;
            }

            return result;
          } else {
            return {
              code: 200,
              message: '请求成功',
              data,
            };
          }
        } else {
          return {
            code: 200,
            message: '请求成功',
          };
        }
      }),
    );
  }
}
