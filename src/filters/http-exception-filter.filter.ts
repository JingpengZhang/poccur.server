import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();
    console.log('exception------',exception);

    const { message, code } = exception.getResponse() as any;
    response.status(status).send({
      code: code || status,
      timestamp: +new Date(),
      path: request.url,
      error: 'Bad Request',
      message,
    });
  }
}