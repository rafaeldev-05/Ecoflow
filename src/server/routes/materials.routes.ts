import { Router } from 'express';

import { getMaterials, postMaterial } from '../controllers/materials.controller';
import { requireAuth } from '../middlewares/auth.middleware';

export const materialsRoutes = Router();

materialsRoutes.use(requireAuth);

materialsRoutes.get('/', getMaterials);
materialsRoutes.post('/', postMaterial);
