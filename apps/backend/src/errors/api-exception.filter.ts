import { Catch } from '@nestjs/common';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common/interfaces';
import { ApiErrorRenderer } from './api-error-renderer';
import {
  HttpErrorRepresentable,
  IsHttpErrorRepresentable,
} from './http-error-representable';
import { AppError, InternalError, IsAppError } from './app-errors';
import { Request, Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private errorRenderer = new ApiErrorRenderer();

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let error: AppError & HttpErrorRepresentable;
    if (IsHttpErrorRepresentable(exception) && IsAppError(exception)) {
      error = exception;
      //use logger
      console.log('Error occurred', exception);
    } else {
      console.log('Error occurred', exception);
      error = new InternalError();
    }

    const errorData = this.errorRenderer.renderError(error);
    response.status(error.httpStatus).json(errorData);
  }
}
