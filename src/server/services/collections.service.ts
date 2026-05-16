import type { Collection, CollectionStatus } from '@prisma/client';

import { prisma } from '../db/prisma';
import { withTemporaryDatabaseRetry } from '../db/prisma-retry';

export type CreateCollectionInput = {
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

type CollectionWithMaterial = Collection & {
  material: {
    name: string;
    weightKg: unknown;
  };
};

function mapCollection(collection: CollectionWithMaterial) {
  return {
    id: collection.id,
    material_id: collection.materialId,
    user_id: collection.userId,
    pickup_address: collection.pickupAddress,
    scheduled_date: collection.scheduledDate.toISOString(),
    scheduled_time: collection.scheduledTime,
    status: collection.status,
    driver_name: collection.driverName,
    driver_phone: collection.driverPhone,
    notes: collection.notes,
    collected_at: collection.collectedAt?.toISOString() ?? null,
    completed_at: collection.completedAt?.toISOString() ?? null,
    created_at: collection.createdAt.toISOString(),
    updated_at: collection.updatedAt.toISOString(),
    material: {
      name: collection.material.name,
      weight_kg: Number(collection.material.weightKg),
    },
  };
}

export async function listCollections(userId?: string) {
  const collections = await withTemporaryDatabaseRetry(() =>
    prisma.collection.findMany({
      where: userId ? { userId } : undefined,
      include: {
        material: {
          select: {
            name: true,
            weightKg: true,
          },
        },
      },
      orderBy: {
        scheduledDate: 'desc',
      },
    }),
  );

  return collections.map(mapCollection);
}

export async function materialExistsForUser(materialId: string, userId: string) {
  const material = await withTemporaryDatabaseRetry(() =>
    prisma.material.findFirst({
      where: {
        id: materialId,
        userId,
      },
      select: {
        id: true,
      },
    }),
  );

  return Boolean(material);
}

export async function createCollection(input: CreateCollectionInput) {
  const collection = await withTemporaryDatabaseRetry(() =>
    prisma.collection.create({
      data: {
        userId: input.user_id,
        materialId: input.material_id,
        pickupAddress: input.pickup_address,
        scheduledDate: new Date(`${input.scheduled_date}T00:00:00.000Z`),
        scheduledTime: input.scheduled_time ?? null,
        driverName: input.driver_name ?? null,
        driverPhone: input.driver_phone ?? null,
        notes: input.notes ?? null,
        status: input.status ?? 'agendada',
      },
      include: {
        material: {
          select: {
            name: true,
            weightKg: true,
          },
        },
      },
    }),
  );

  return mapCollection(collection);
}
