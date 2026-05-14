import { apiFetch } from '@/lib/api';

export type DashboardSummary = {
  totalMaterials: number;
  totalCollections: number;
  pendingCollections: number;
  totalWeightKg: number;
  co2Avoided: number;
  collectionsByStatus: Record<string, number>;
  latestEnvironmentalMetric: {
    id: string;
    user_id: string | null;
    period_start: string;
    period_end: string;
    total_weight_kg: number | null;
    co2_avoided_kg: number | null;
    collections_completed: number | null;
    materials_recycled: number | null;
    recycling_rate: number | null;
  } | null;
};

export async function fetchDashboardSummary(userId?: string) {
  const params = new URLSearchParams();

  if (userId) {
    params.set('userId', userId);
  }

  const query = params.toString();
  return apiFetch<DashboardSummary>(`/api/dashboard/summary${query ? `?${query}` : ''}`);
}
