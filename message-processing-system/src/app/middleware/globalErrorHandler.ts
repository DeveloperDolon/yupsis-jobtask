import { ErrorRequestHandler } from 'express';
import { TErrorSources } from '../interface/error';
import { ZodError } from 'zod';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import AppError from '../errors/AppError';
import config from '../config';
import handleDuplicateError from '../errors/handleDuplicateError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next): void => {

  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedErrors = handleZodError(err);
    statusCode = simplifiedErrors?.statusCode;
    message = simplifiedErrors?.message;
    errorSources = simplifiedErrors?.errorSources;
  } else if (err?.name === 'ValidationError') {
    const simplifiedErrors = handleValidationError(err);
    statusCode = simplifiedErrors?.statusCode;
    message = simplifiedErrors?.message;
    errorSources = simplifiedErrors?.errorSources;
  } else if (err?.name === 'CastError') {
    const simplifiedErrors = handleCastError(err);
    statusCode = simplifiedErrors?.statusCode;
    message = simplifiedErrors?.message;
    errorSources = simplifiedErrors?.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
  return;
};

export default globalErrorHandler;
