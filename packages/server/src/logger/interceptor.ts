import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';
import * as Bunyan from 'bunyan';
import * as Express from 'express';
import { ServerResponse } from 'http';
import { getClientIp } from 'request-ip';
import { LoggerConfig } from './logger.module';

export class RequestInterceptor implements NestInterceptor {
  private readonly logger: Bunyan;
  constructor(options: LoggerConfig, root: Bunyan) {
    this.logger = root;
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const start = new Date();

    let urlOrQuery: string;
    let method: string;
    let status: number;
    const data: Record<string, any> = {};
    if ((context as any).contextType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const req = gqlCtx.getContext().req;
      const info = gqlCtx.getInfo();
      data.method = info.parentType.name;
      data.operationName = info.operation.name.value;
      data.ip = getClientIp(req);
      data.headers = { ...req.headers };
    } else {
      const ctx = context.switchToHttp();
      const req = ctx.getRequest<Express.Request>();
      data.method = req.method;
      data.status = req.statusCode;
      data.url = req.url;
      data.ip = getClientIp(req);
      data.headers = { ...req.headers };
    }

    this.logger.info({
      direction: 'inbound',
      ...data,
    });
    if ((context as any).contextType === 'graphql') {
      return next.handle();
    } else {
      return next.handle().pipe(
        tap(() => {
          const ms = new Date().valueOf() - start.valueOf();
          this.logger.info({
            direction: 'outbound',
            'response-time': ms,
            method: data.method,
            url: data.url,
          });
        }),
      );
    }
  }
}
