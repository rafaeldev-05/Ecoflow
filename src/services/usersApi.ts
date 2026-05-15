import { apiFetch } from '@/lib/api';
import type { AppRole } from '@/hooks/useAuth';

export type ApiUser = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  company: string | null;
  phone: string | null;
  role: AppRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserListItem = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  company: string | null;
  phone: string | null;
  role: AppRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateUserPayload = {
  email: string;
  password: string;
  fullName: string;
  role: AppRole;
  avatarUrl?: string | null;
  company?: string | null;
  phone?: string | null;
};

export type UpdateUserPayload = Partial<
  Omit<CreateUserPayload, 'password'> & {
    isActive: boolean;
  }
>;

function mapUser(user: ApiUser): UserListItem {
  return {
    id: user.id,
    user_id: user.id,
    full_name: user.fullName,
    email: user.email,
    avatar_url: user.avatarUrl,
    company: user.company,
    phone: user.phone,
    role: user.role,
    is_active: user.isActive,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };
}

export async function fetchUsers() {
  const users = await apiFetch<ApiUser[]>('/api/users');
  return users.map(mapUser);
}

export async function createUser(payload: CreateUserPayload) {
  const user = await apiFetch<ApiUser>('/api/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return mapUser(user);
}

export async function updateUser(id: string, payload: UpdateUserPayload) {
  const user = await apiFetch<ApiUser>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return mapUser(user);
}

export async function deactivateUser(id: string) {
  const user = await apiFetch<ApiUser>(`/api/users/${id}/deactivate`, {
    method: 'PATCH',
  });

  return mapUser(user);
}
