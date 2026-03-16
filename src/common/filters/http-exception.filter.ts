import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody =
      exception instanceof HttpException
        ? (exception.getResponse() as ErrorResponse | string)
        : 'Internal server error';

    const message =
      typeof responseBody === 'object'
        ? responseBody.message || responseBody.error || responseBody
        : responseBody;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      protocol: 'DOM_FELIU_KERNEL_ERROR',
    };

    // Log only critical errors to console in production
    if (status === (HttpStatus.INTERNAL_SERVER_ERROR as number)) {
      console.error(
        `[KERNEL_CRITICAL_ERROR] ${request.method} ${request.url}`,
        exception,
      );
    }

    response.status(status).json(errorResponse);
  }
}
