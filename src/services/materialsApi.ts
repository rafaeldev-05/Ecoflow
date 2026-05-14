import { apiFetch } from '@/lib/api';

export type MaterialApiItem = {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: string | null;
  weight_kg: number;
  status: string | null;
  created_at: string;
  category: {
    id: string;
    name: string;
    icon: string | null;
  } | null;
};

export type CreateMaterialPayload = {
  name: string;
  description?: string | null;
  category_id?: string | null;
  weight_kg: number;
  quantity: number;
  unit: string;
  user_id: string;
};

export async function fetchMaterials(userId: string) {
  const params = new URLSearchParams({ userId });
  return apiFetch<MaterialApiItem[]>(`/api/materials?${params.toString()}`);
}

export async function createMaterial(payload: CreateMaterialPayload) {
  return apiFetch<MaterialApiItem>('/api/materials', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      status: 'pendente',
    }),
  });
}
