import { apiFetch } from '@/lib/api';

export type CollectionStatus =
  | 'agendada'
  | 'em_transito'
  | 'processando'
  | 'coletada'
  | 'concluida'
  | 'cancelada';

export type CollectionApiItem = {
  id: string;
  material_id: string;
  user_id: string;
  pickup_address: string;
  scheduled_date: string;
  scheduled_time: string | null;
  status: CollectionStatus;
  driver_name: string | null;
  driver_phone: string | null;
  notes: string | null;
  material: {
    name: string;
    weight_kg: number;
  };
};

export type CreateCollectionPayload = {
  user_id: string;
  material_id: string;
  pickup_address: string;
  scheduled_date: string;
  scheduled_time?: string | null;
  driver_name?: string | null;
  driver_phone?: string | null;
  notes?: string | null;
  status?: CollectionStatus;
};

export async function fetchCollections(userId: string) {
  const params = new URLSearchParams({ userId });
  return apiFetch<CollectionApiItem[]>(`/api/collections?${params.toString()}`);
}

export async function createCollection(payload: CreateCollectionPayload) {
  return apiFetch<CollectionApiItem>('/api/collections', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      status: payload.status ?? 'agendada',
    }),
  });
}
