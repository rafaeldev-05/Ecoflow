import type { CollectionStatus } from '@prisma/client';
import type { Request, Response } from 'express';

import {
  createCollection,
  listCollections,
  materialExistsForUser,
  type CreateCollectionInput,
} from '../services/collections.service';

const collectionStatuses = new Set<CollectionStatus>([
  'agendada',
  'em_transito',
  'coletada',
  'processando',
  'concluida',
  'cancelada',
]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime());
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function getCollections(request: Request, response: Response) {
  const userId = typeof request.query.userId === 'string' ? request.query.userId : undefined;
  const collections = await listCollections(userId);

  response.json(collections);
}

export async function postCollection(request: Request, response: Response) {
  const body = request.body as Partial<CreateCollectionInput>;
  const userId = request.user?.id;

  if (!isNonEmptyString(userId)) {
    response.status(401).json({ message: 'Autenticacao obrigatoria.' });
    return;
  }

  if (!isNonEmptyString(body.material_id)) {
    response.status(400).json({ message: 'Material e obrigatorio.' });
    return;
  }

  if (!isUuid(body.material_id)) {
    response.status(400).json({ message: 'Material invalido.' });
    return;
  }

  if (!isNonEmptyString(body.pickup_address)) {
    response.status(400).json({ message: 'Endereco de coleta e obrigatorio.' });
    return;
  }

  if (!isNonEmptyString(body.scheduled_date) || !isValidDateString(body.scheduled_date)) {
    response.status(400).json({ message: 'Data agendada invalida.' });
    return;
  }

  if (body.status && !collectionStatuses.has(body.status)) {
    response.status(400).json({ message: 'Status de coleta invalido.' });
    return;
  }

  const materialExists = await materialExistsForUser(body.material_id, userId);

  if (!materialExists) {
    response.status(404).json({ message: 'Material nao encontrado para este usuario.' });
    return;
  }

  const collection = await createCollection({
    user_id: userId,
    material_id: body.material_id,
    pickup_address: body.pickup_address.trim(),
    scheduled_date: body.scheduled_date,
    scheduled_time: body.scheduled_time ?? null,
    driver_name: body.driver_name ?? null,
    driver_phone: body.driver_phone ?? null,
    notes: body.notes ?? null,
    status: body.status ?? 'agendada',
  });

  response.status(201).json(collection);
}
