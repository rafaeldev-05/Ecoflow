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
  user: ApiAuthUser;
};

type MeResponse = {
  user: ApiAuthUser;
};

type LogoutResponse = {
  message: string;
};

export function loginRequest(email: string, password: string) {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export function meRequest() {
  return apiFetch<MeResponse>('/api/auth/me', {
    method: 'GET',
  });
}

export function logoutRequest() {
  return apiFetch<LogoutResponse>('/api/auth/logout', {
    method: 'POST',
  });
}
