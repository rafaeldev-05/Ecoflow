import { apiFetch } from '@/lib/api';

export type AppRole = 'admin' | 'gestor' | 'operacional';

export type ApiAuthUser = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  company: string | null;
  phone: string | null;
  role: AppRole;
  isActive: boolean;
};

type LoginResponse = {
  token: string;
  user: ApiAuthUser;
};

type MeResponse = {
  user: ApiAuthUser;
};

type LogoutResponse = {
  message: string;
};

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function loginRequest(email: string, password: string) {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export function meRequest(token: string) {
  return apiFetch<MeResponse>('/api/auth/me', {
    method: 'GET',
    headers: authHeaders(token),
  });
}

export function logoutRequest(token: string) {
  return apiFetch<LogoutResponse>('/api/auth/logout', {
    method: 'POST',
    headers: authHeaders(token),
  });
}
