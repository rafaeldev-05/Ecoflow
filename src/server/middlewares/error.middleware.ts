import type { ErrorRequestHandler } from 'express';

import { isTemporaryDatabaseError } from '../db/prisma-retry';

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  if (isTemporaryDatabaseError(error)) {
    response.status(500).json({
      status: 'error',
      message: 'Banco de dados temporariamente indisponivel.',
    });
    return;
  }

  const statusCode = typeof error?.statusCode === 'number' ? error.statusCode : error?.status;

  if (typeof statusCode === 'number' && statusCode >= 400 && statusCode < 500) {
    response.status(statusCode).json({
      status: 'error',
      message: 'Requisicao invalida.',
    });
    return;
  }

  response.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
};
