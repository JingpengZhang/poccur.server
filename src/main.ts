import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { HttpExceptionFilter } from './filters/http-exception-filter.filter';
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

  await app.register(fastifyMultipart);

  await app.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'storage'),
    prefix: '/public/',
  });

  await app.listen(3000);
}

bootstrap();
