import type { Request, Response } from 'express';

import {
  createMaterial,
  listMaterials,
  type CreateMaterialInput,
} from '../services/materials.service';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function getMaterials(request: Request, response: Response) {
  const userId = typeof request.query.userId === 'string' ? request.query.userId : undefined;
  const materials = await listMaterials(userId);

  response.json(materials);
}

export async function postMaterial(request: Request, response: Response) {
  const body = request.body as Partial<CreateMaterialInput>;

  if (!isNonEmptyString(body.name)) {
    response.status(400).json({ message: 'Nome do material e obrigatorio.' });
    return;
  }

  if (!isNonEmptyString(body.user_id)) {
    response.status(400).json({ message: 'Usuario e obrigatorio.' });
    return;
  }

  const quantity = Number(body.quantity ?? 1);
  const weightKg = Number(body.weight_kg ?? 1);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    response.status(400).json({ message: 'Quantidade invalida.' });
    return;
  }

  if (!Number.isFinite(weightKg) || weightKg < 0) {
    response.status(400).json({ message: 'Peso invalido.' });
    return;
  }

  const material = await createMaterial({
    name: body.name.trim(),
    description: body.description?.trim() || null,
    category_id: body.category_id ?? null,
    weight_kg: weightKg,
    quantity,
    unit: body.unit?.trim() || 'kg',
    status: body.status ?? 'pendente',
    location: body.location ?? null,
    user_id: body.user_id,
  });

  response.status(201).json(material);
}
