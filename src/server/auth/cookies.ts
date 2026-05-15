import type { CookieOptions, Response } from 'express';

const defaultCookieName = 'ecoflow_token';

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export function getAuthCookieName() {
  return process.env.AUTH_COOKIE_NAME?.trim() || defaultCookieName;
}

export function getAuthCookieOptions(): CookieOptions {
  const production = isProduction();

  return {
    httpOnly: true,
    sameSite: production ? 'none' : 'lax',
    secure: production,
    path: '/',
  };
}

export function setAuthCookie(response: Response, token: string, maxAgeMs?: number) {
  response.cookie(getAuthCookieName(), token, {
    ...getAuthCookieOptions(),
    maxAge: maxAgeMs,
  });
}

export function clearAuthCookie(response: Response) {
  response.clearCookie(getAuthCookieName(), getAuthCookieOptions());
}
