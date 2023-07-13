import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import type { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(error: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    switch (error.code) {
      case 'P2025':
        const exception = new NotFoundException();
        const statusCode = exception.getStatus();

        return response.status(statusCode).json({
          statusCode,
          message: exception.message,
        });
      default:
        break;
    }
  }
}
