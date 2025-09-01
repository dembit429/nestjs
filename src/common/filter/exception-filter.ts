import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();
    const ctx = gqlHost.getContext();

    const status = exception.getStatus();
    const message = exception.message;
    const response = exception.getResponse();

    this.logger.error(`GraphQL Error [${status}]: ${message}`, exception.stack);

    throw new GraphQLError(message, {
      extensions: {
        code: status === 409 ? 'CONFLICT' : 'INTERNAL_SERVER_ERROR',
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: info?.fieldName || 'unknown',
        operation: info?.operation?.operation || 'unknown',
        ...(typeof response === 'object' ? response : {}),
      },
    });
  }
}
