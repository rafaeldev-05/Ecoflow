import type { Material } from '@prisma/client';

import { prisma } from '../db/prisma';

export type CreateMaterialInput = {
  name: string;
  description?: string | null;
  category_id?: string | null;
  weight_kg?: number;
  quantity?: number;
  unit?: string | null;
  status?: string | null;
  location?: string | null;
  user_id: string;
};

function mapMaterial(material: Material & { category?: { id: string; name: string; icon: string | null } | null }) {
  return {
    id: material.id,
    name: material.name,
    description: material.description,
    category_id: material.categoryId,
    quantity: material.quantity,
    unit: material.unit,
    weight_kg: Number(material.weightKg),
    status: material.status,
    location: material.location,
    user_id: material.userId,
    created_at: material.createdAt.toISOString(),
    updated_at: material.updatedAt.toISOString(),
    category: material.category
      ? {
          id: material.category.id,
          name: material.category.name,
          icon: material.category.icon,
        }
      : null,
  };
}

export async function listMaterials(userId?: string) {
  const materials = await prisma.material.findMany({
    where: userId ? { userId } : undefined,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return materials.map(mapMaterial);
}

export async function createMaterial(input: CreateMaterialInput) {
  const material = await prisma.material.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      categoryId: input.category_id ?? null,
      weightKg: input.weight_kg ?? 1,
      quantity: input.quantity ?? 1,
      unit: input.unit ?? 'kg',
      status: input.status ?? 'pendente',
      location: input.location ?? null,
      userId: input.user_id,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
    },
  });

  return mapMaterial(material);
}
