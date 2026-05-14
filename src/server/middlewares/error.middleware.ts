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

  response.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
};
