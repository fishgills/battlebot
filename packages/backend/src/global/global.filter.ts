import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { time } from 'console';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { Request, Response } from 'express';

@Catch(QueryFailedError)
export class TypoORMExceptionFilter extends BaseExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.UNPROCESSABLE_ENTITY;
    const message = exception.message;
    const code = exception.name;
    response
      .status(status)
      .json(GlobalResponseError(status, message, code, request));
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('AllExceptionsFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let code = 'HttpException';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let message = (exception as any).message;
    Logger.error(
      message,
      (exception as any).stack,
      `${request.method} ${request.url}`,
    );

    switch (exception.constructor) {
      case QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as TypeORMError).message;
        code = (exception as TypeORMError).name;
        break;
      default:
        Logger.debug(exception.constructor);
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }
    response
      .status(status)
      .json(GlobalResponseError(status, message, code, request));
  }
}

export interface IResponseError {
  statusCode: number;
  message: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
}
export const GlobalResponseError: (
  statusCode: number,
  message: string,
  code: string,
  request: Request,
) => IResponseError = (
  statusCode: number,
  message: string,
  code: string,
  request: Request,
): IResponseError => {
  return {
    statusCode: statusCode,
    message,
    code,
    timestamp: new Date().toISOString(),
    path: request.url,
    method: request.method,
  };
};
