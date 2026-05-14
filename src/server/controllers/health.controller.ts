import type { Request, Response } from 'express';

import { prisma } from '../db/prisma';

export function getHealth(_request: Request, response: Response) {
  response.json({
    status: 'ok',
    service: 'ecoflow-api',
  });
}

export async function getDatabaseHealth(_request: Request, response: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`;

    response.json({
      status: 'ok',
      database: 'connected',
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Database health check failed:', error);
    }

    response.status(503).json({
      status: 'error',
      database: 'unavailable',
      message: 'Database connection failed.',
    });
  }
}
