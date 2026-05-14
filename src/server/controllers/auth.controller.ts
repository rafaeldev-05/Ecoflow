import type { Request, Response } from 'express';

import { loginWithPassword } from '../services/auth.service';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function postLogin(request: Request, response: Response) {
  const body = request.body as {
    email?: unknown;
    password?: unknown;
  };

  if (!isNonEmptyString(body.email) || !isNonEmptyString(body.password)) {
    response.status(400).json({ message: 'Email e senha sao obrigatorios.' });
    return;
  }

  let result: Awaited<ReturnType<typeof loginWithPassword>>;

  try {
    result = await loginWithPassword(body.email, body.password);
  } catch (error) {
    if (error instanceof Error && error.message === 'JWT_SECRET nao configurado.') {
      response.status(500).json({ message: 'JWT_SECRET nao configurado no backend.' });
      return;
    }

    throw error;
  }

  if (result.status === 'invalid_credentials') {
    response.status(401).json({ message: 'Credenciais invalidas.' });
    return;
  }

  if (result.status === 'inactive_user') {
    response.status(403).json({ message: 'Usuario inativo.' });
    return;
  }

  response.json({
    token: result.token,
    user: result.user,
  });
}

export async function getMe(request: Request, response: Response) {
  response.json({
    user: request.user,
  });
}

export async function postLogout(_request: Request, response: Response) {
  response.json({
    message: 'Logout realizado com sucesso.',
  });
}
