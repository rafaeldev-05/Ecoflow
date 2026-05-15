import { Router } from 'express';

import {
  getUsers,
  patchDeactivateUser,
  postUser,
  putUser,
} from '../controllers/users.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

export const usersRoutes = Router();

usersRoutes.use(requireAuth, requireRole(['admin']));

usersRoutes.get('/', getUsers);
usersRoutes.post('/', postUser);
usersRoutes.put('/:id', putUser);
usersRoutes.patch('/:id/deactivate', patchDeactivateUser);
