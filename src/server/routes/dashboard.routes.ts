import { Router } from 'express';

import { getDashboardSummaryController } from '../controllers/dashboard.controller';
import { requireAuth } from '../middlewares/auth.middleware';

export const dashboardRoutes = Router();

dashboardRoutes.use(requireAuth);

dashboardRoutes.get('/summary', getDashboardSummaryController);
