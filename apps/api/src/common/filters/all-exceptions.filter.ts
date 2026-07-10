import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@alsayed/database';
import type { Request, Response } from 'express';

interface ErrorBody {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  timestamp: string;
}

/**
 * Global exception filter. Produces consistent, production-safe JSON error
 * responses. Raw Prisma errors and stack traces are never returned to the
 * client; unexpected errors are logged server-side only.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message: string | string[] = 'An unexpected error occurred.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const body = res as Record<string, unknown>;
        message = (body.message as string | string[]) ?? exception.message;
        error = (body.error as string) ?? exception.name;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = this.mapPrismaError(exception);
      status = mapped.status;
      error = mapped.error;
      message = mapped.message;
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      error = 'Bad Request';
      message = 'Invalid request data.';
    } else {
      this.logger.error(
        `Unhandled exception on ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    const body: ErrorBody = {
      statusCode: status,
      error,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(body);
  }

  private mapPrismaError(exception: Prisma.PrismaClientKnownRequestError): {
    status: number;
    error: string;
    message: string;
  } {
    const code = String(exception.code);
    const mapped: Record<
      string,
      { status: number; error: string; message: string }
    > = {
      P2002: {
        status: HttpStatus.CONFLICT,
        error: 'Conflict',
        message: 'A record with the same unique value already exists.',
      },
      P2003: {
        status: HttpStatus.CONFLICT,
        error: 'Conflict',
        message: 'The operation violates a relationship constraint.',
      },
      P2025: {
        status: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'The requested record was not found.',
      },
    };
    return (
      mapped[code] ?? {
        status: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: 'The database request could not be completed.',
      }
    );
  }
}
