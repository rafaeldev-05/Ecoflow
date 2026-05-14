import { apiFetch } from '@/lib/api';

export type EnvironmentalMetricApiItem = {
  id: string;
  user_id: string | null;
  period_start: string;
  period_end: string;
  total_weight_kg: number | null;
  co2_avoided_kg: number | null;
  collections_completed: number | null;
  materials_recycled: number | null;
  recycling_rate: number | null;
  created_at: string;
  updated_at: string;
};

export async function fetchLatestEnvironmentalMetric(userId?: string) {
  const params = new URLSearchParams();

  if (userId) {
    params.set('userId', userId);
  }

  const query = params.toString();
  return apiFetch<EnvironmentalMetricApiItem | null>(
    `/api/environmental-metrics${query ? `?${query}` : ''}`,
  );
}
