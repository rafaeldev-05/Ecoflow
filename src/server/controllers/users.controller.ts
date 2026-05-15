import type { AppRole } from '@prisma/client';
import type { Request, Response } from 'express';

import {
  createUser,
  deactivateUser,
  listUsers,
  updateUser,
  UserServiceError,
  type CreateUserInput,
  type UpdateUserInput,
} from '../services/users.service';

const allowedRoles: AppRole[] = ['admin', 'gestor', 'operacional'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidRole(value: unknown): value is AppRole {
  return allowedRoles.includes(value as AppRole);
}

function optionalString(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return typeof value === 'string' ? value.trim() || null : undefined;
}

function handleUserError(error: unknown, response: Response) {
  if (error instanceof UserServiceError) {
    response.status(error.status).json({ message: error.message });
    return;
  }

  throw error;
}

function getRouteParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function getUsers(_request: Request, response: Response) {
  const users = await listUsers();
  response.json(users);
}

export async function postUser(request: Request, response: Response) {
  const body = request.body as Partial<CreateUserInput>;

  if (!isNonEmptyString(body.email) || !emailPattern.test(body.email.trim())) {
    response.status(400).json({ message: 'Email invalido.' });
    return;
  }

  if (!isNonEmptyString(body.password) || body.password.length < 6) {
    response.status(400).json({ message: 'Senha deve ter no minimo 6 caracteres.' });
    return;
  }

  if (!isNonEmptyString(body.fullName)) {
    response.status(400).json({ message: 'Nome completo e obrigatorio.' });
    return;
  }

  if (!isValidRole(body.role)) {
    response.status(400).json({ message: 'Perfil invalido.' });
    return;
  }

  try {
    const user = await createUser({
      email: body.email,
      password: body.password,
      fullName: body.fullName,
      role: body.role,
      avatarUrl: optionalString(body.avatarUrl),
      company: optionalString(body.company),
      phone: optionalString(body.phone),
    });

    response.status(201).json(user);
  } catch (error) {
    handleUserError(error, response);
  }
}

export async function putUser(request: Request, response: Response) {
  const userId = getRouteParam(request.params.id);

  if (!userId) {
    response.status(400).json({ message: 'Usuario invalido.' });
    return;
  }

  const body = request.body as Partial<UpdateUserInput>;
  const input: UpdateUserInput = {};

  if (body.email !== undefined) {
    if (!isNonEmptyString(body.email) || !emailPattern.test(body.email.trim())) {
      response.status(400).json({ message: 'Email invalido.' });
      return;
    }

    input.email = body.email;
  }

  if (body.fullName !== undefined) {
    if (!isNonEmptyString(body.fullName)) {
      response.status(400).json({ message: 'Nome completo e obrigatorio.' });
      return;
    }

    input.fullName = body.fullName;
  }

  if (body.role !== undefined) {
    if (!isValidRole(body.role)) {
      response.status(400).json({ message: 'Perfil invalido.' });
      return;
    }

    input.role = body.role;
  }

  if (body.isActive !== undefined) {
    if (typeof body.isActive !== 'boolean') {
      response.status(400).json({ message: 'Status do usuario invalido.' });
      return;
    }

    input.isActive = body.isActive;
  }

  input.avatarUrl = optionalString(body.avatarUrl);
  input.company = optionalString(body.company);
  input.phone = optionalString(body.phone);

  try {
    const user = await updateUser(userId, input);
    response.json(user);
  } catch (error) {
    handleUserError(error, response);
  }
}

export async function patchDeactivateUser(request: Request, response: Response) {
  const userId = getRouteParam(request.params.id);

  if (!userId) {
    response.status(400).json({ message: 'Usuario invalido.' });
    return;
  }

  try {
    const user = await deactivateUser(userId);
    response.json(user);
  } catch (error) {
    handleUserError(error, response);
  }
}
