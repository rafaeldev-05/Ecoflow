import type { Request, Response } from 'express';

import { getLatestEnvironmentalMetric } from '../services/environmental-metrics.service';

export async function getEnvironmentalMetrics(request: Request, response: Response) {
  const userId = typeof request.query.userId === 'string' ? request.query.userId : undefined;
  const metric = await getLatestEnvironmentalMetric(userId);

  response.json(metric);
}
