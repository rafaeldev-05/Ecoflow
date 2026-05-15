import { Router } from 'express';

import { getCollections, postCollection } from '../controllers/collections.controller';
import { requireAuth } from '../middlewares/auth.middleware';

export const collectionsRoutes = Router();

collectionsRoutes.use(requireAuth);

collectionsRoutes.get('/', getCollections);
collectionsRoutes.post('/', postCollection);
