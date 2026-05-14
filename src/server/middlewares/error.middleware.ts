import type { ErrorRequestHandler } from 'express';

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  response.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
};
