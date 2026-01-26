import { supabase } from '@/integrations/supabase/client';

export type CollectionStatus =
  | 'agendada'
  | 'em_transito'
  | 'processando'
  | 'coletada'
  | 'concluida'
  | 'cancelada';

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

export async function createCollection(payload: CreateCollectionPayload) {
  const { data, error } = await supabase
    .from('collections')
    .insert({
      user_id: payload.user_id,
      material_id: payload.material_id,
      pickup_address: payload.pickup_address,
      scheduled_date: payload.scheduled_date,
      scheduled_time: payload.scheduled_time ?? null,
      driver_name: payload.driver_name ?? null,
      driver_phone: payload.driver_phone ?? null,
      notes: payload.notes ?? null,
      status: payload.status ?? 'agendada', // ✅ default válido
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
