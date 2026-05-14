import { Router } from 'express';

import { getDashboardSummaryController } from '../controllers/dashboard.controller';

export const dashboardRoutes = Router();

dashboardRoutes.get('/summary', getDashboardSummaryController);
