import type { AppRole } from '@prisma/client';
import jwt from 'jsonwebtoken';

import type { JwtPayload, SignOptions } from 'jsonwebtoken';

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: AppRole;
};

const defaultTokenExpiresIn: SignOptions['expiresIn'] = '1d';
const appRoles: AppRole[] = ['admin', 'gestor', 'operacional'];

function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret || secret === 'change-me' || secret === 'troque-este-valor') {
    throw new Error('JWT_SECRET nao configurado.');
  }

  return secret;
}

function isAppRole(value: unknown): value is AppRole {
  return typeof value === 'string' && appRoles.includes(value as AppRole);
}

export function getJwtExpiresIn(): SignOptions['expiresIn'] {
  return (process.env.JWT_EXPIRES_IN?.trim() || defaultTokenExpiresIn) as SignOptions['expiresIn'];
}

export function getJwtMaxAgeMs() {
  const expiresIn = getJwtExpiresIn();

  if (typeof expiresIn === 'number') {
    return expiresIn * 1000;
  }

  const match = /^(\d+)([smhd])$/.exec(expiresIn);

  if (!match) {
    return undefined;
  }

  const value = Number(match[1]);
  const unit = match[2];
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit as keyof typeof multipliers];
}

export function signAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(
    {
      email: payload.email,
      role: payload.role,
    },
    getJwtSecret(),
    {
      expiresIn: getJwtExpiresIn(),
      subject: payload.sub,
    },
  );
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, getJwtSecret());

  if (typeof decoded === 'string') {
    throw new Error('Token invalido.');
  }

  const payload = decoded as JwtPayload & {
    email?: unknown;
    role?: unknown;
  };

  if (!payload.sub || typeof payload.email !== 'string' || !isAppRole(payload.role)) {
    throw new Error('Token invalido.');
  }

  return {
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}
