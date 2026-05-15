import type { AppRole } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';

import { getAuthCookieName } from '../auth/cookies';
import { verifyAuthToken } from '../auth/jwt';
import { getSafeUserById } from '../services/auth.service';

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
  const token = request.cookies?.[getAuthCookieName()];

  if (typeof token !== 'string' || !token) {
    response.status(401).json({ message: 'Token de autenticacao obrigatorio.' });
    return;
  }

  try {
    const payload = verifyAuthToken(token);
    const user = await getSafeUserById(payload.sub);

    if (!user || !user.isActive) {
      response.status(401).json({ message: 'Sessao invalida.' });
      return;
    }

    request.user = user;
    next();
  } catch (error) {
    if (error instanceof Error && error.message === 'JWT_SECRET nao configurado.') {
      response.status(500).json({ message: 'JWT_SECRET nao configurado no backend.' });
      return;
    }

    response.status(401).json({ message: 'Token invalido ou expirado.' });
  }
}

export function requireRole(allowedRoles: AppRole[]) {
  return function requireAllowedRole(request: Request, response: Response, next: NextFunction) {
    if (!request.user) {
      response.status(401).json({ message: 'Autenticacao obrigatoria.' });
      return;
    }

    if (!allowedRoles.includes(request.user.role)) {
      response.status(403).json({ message: 'Permissao insuficiente.' });
      return;
    }

    next();
  };
}
