import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception-filter.filter';
import fastifyMultipart from '@fastify/multipart';
import * as fastifyStatic from '@fastify/static';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // 允许跨域
  app.enableCors();

  // 全局错误过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局注册拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.register(fastifyMultipart, {
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      fieldSize: 100, // Max field value size in bytes
      fields: 10, // Max number of non-file fields
      fileSize: 50 * 1024 * 1024, // For multipart forms, the max file size in bytes
      files: 50, // Max number of file fields
      headerPairs: 2000, // Max number of header key=>value pairs
    },
  });

  await app.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'storage'),
    prefix: '/public/',
  });

  await app.listen(3000);
}

bootstrap();
