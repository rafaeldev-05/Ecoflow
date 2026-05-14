import { Router } from 'express';

import { getEnvironmentalMetrics } from '../controllers/environmental-metrics.controller';

export const environmentalMetricsRoutes = Router();

environmentalMetricsRoutes.get('/', getEnvironmentalMetrics);
