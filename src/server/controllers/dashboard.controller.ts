import type { Request, Response } from 'express';

import { getDashboardSummary } from '../services/dashboard.service';

export async function getDashboardSummaryController(request: Request, response: Response) {
  const userId = typeof request.query.userId === 'string' ? request.query.userId : undefined;
  const summary = await getDashboardSummary(userId);

  response.json(summary);
}
