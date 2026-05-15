import { Router } from 'express';

import { getEnvironmentalMetrics } from '../controllers/environmental-metrics.controller';
import { requireAuth } from '../middlewares/auth.middleware';

export const environmentalMetricsRoutes = Router();

environmentalMetricsRoutes.use(requireAuth);

environmentalMetricsRoutes.get('/', getEnvironmentalMetrics);
