import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || null,
      error: exception.name,
    };

    // Если это ошибка валидации, добавляем детали ошибок
    if (status === HttpStatus.BAD_REQUEST) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object') {
        errorResponse['errors'] = exceptionResponse;
      }
    }

    response.status(status).json(errorResponse);
  }
}
