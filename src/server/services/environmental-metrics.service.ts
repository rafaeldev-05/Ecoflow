import type { EnvironmentalMetric } from '@prisma/client';

import { prisma } from '../db/prisma';

function mapEnvironmentalMetric(metric: EnvironmentalMetric) {
  return {
    id: metric.id,
    user_id: metric.userId,
    period_start: metric.periodStart.toISOString(),
    period_end: metric.periodEnd.toISOString(),
    total_weight_kg: metric.totalWeightKg === null ? null : Number(metric.totalWeightKg),
    co2_avoided_kg: metric.co2AvoidedKg === null ? null : Number(metric.co2AvoidedKg),
    collections_completed: metric.collectionsCompleted,
    materials_recycled: metric.materialsRecycled,
    recycling_rate: metric.recyclingRate === null ? null : Number(metric.recyclingRate),
    created_at: metric.createdAt.toISOString(),
    updated_at: metric.updatedAt.toISOString(),
  };
}

export async function getLatestEnvironmentalMetric(userId?: string) {
  const metric = await prisma.environmentalMetric.findFirst({
    where: userId
      ? {
          OR: [{ userId }, { userId: null }],
        }
      : undefined,
    orderBy: {
      periodEnd: 'desc',
    },
  });

  return metric ? mapEnvironmentalMetric(metric) : null;
}
