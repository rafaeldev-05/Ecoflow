import { Router } from 'express';

import { getMe, postLogin, postLogout } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

export const authRoutes = Router();

authRoutes.post('/login', postLogin);
authRoutes.get('/me', requireAuth, getMe);
authRoutes.post('/logout', postLogout);
