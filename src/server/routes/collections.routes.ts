import { Router } from 'express';

import { getCollections, postCollection } from '../controllers/collections.controller';

export const collectionsRoutes = Router();

collectionsRoutes.get('/', getCollections);
collectionsRoutes.post('/', postCollection);
