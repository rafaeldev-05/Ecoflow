import { prisma } from '../db/prisma';

export async function getDashboardSummary(userId?: string) {
  const materialWhere = userId ? { userId } : undefined;
  const collectionWhere = userId ? { userId } : undefined;

  const [materials, totalMaterials, collections, totalCollections, latestMetric] =
    await Promise.all([
      prisma.material.findMany({
        where: materialWhere,
        select: {
          weightKg: true,
        },
      }),
      prisma.material.count({
        where: materialWhere,
      }),
      prisma.collection.findMany({
        where: collectionWhere,
        select: {
          status: true,
        },
      }),
      prisma.collection.count({
        where: collectionWhere,
      }),
      prisma.environmentalMetric.findFirst({
        where: userId
          ? {
              OR: [{ userId }, { userId: null }],
            }
          : undefined,
        orderBy: {
          periodEnd: 'desc',
        },
      }),
    ]);

  const totalWeightKg = materials.reduce(
    (total, material) => total + Number(material.weightKg),
    0,
  );

  const collectionsByStatus = collections.reduce<Record<string, number>>(
    (totals, collection) => {
      totals[collection.status] = (totals[collection.status] ?? 0) + 1;
      return totals;
    },
    {},
  );

  return {
    totalMaterials,
    totalCollections,
    pendingCollections: collectionsByStatus.agendada ?? 0,
    totalWeightKg,
    co2Avoided: latestMetric?.co2AvoidedKg
      ? Number(latestMetric.co2AvoidedKg)
      : Math.round(totalWeightKg * 2.5),
    collectionsByStatus,
    latestEnvironmentalMetric: latestMetric
      ? {
          id: latestMetric.id,
          user_id: latestMetric.userId,
          period_start: latestMetric.periodStart.toISOString(),
          period_end: latestMetric.periodEnd.toISOString(),
          total_weight_kg:
            latestMetric.totalWeightKg === null ? null : Number(latestMetric.totalWeightKg),
          co2_avoided_kg:
            latestMetric.co2AvoidedKg === null ? null : Number(latestMetric.co2AvoidedKg),
          collections_completed: latestMetric.collectionsCompleted,
          materials_recycled: latestMetric.materialsRecycled,
          recycling_rate:
            latestMetric.recyclingRate === null ? null : Number(latestMetric.recyclingRate),
        }
      : null,
  };
}
