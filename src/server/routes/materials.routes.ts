import { Router } from 'express';

import { getMaterials, postMaterial } from '../controllers/materials.controller';

export const materialsRoutes = Router();

materialsRoutes.get('/', getMaterials);
materialsRoutes.post('/', postMaterial);
