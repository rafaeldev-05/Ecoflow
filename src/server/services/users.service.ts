import type { AppRole, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { prisma } from '../db/prisma';
import { withTemporaryDatabaseRetry } from '../db/prisma-retry';

export type SafeUser = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  company: string | null;
  phone: string | null;
  role: AppRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserInput = {
  email: string;
  password: string;
  fullName: string;
  role: AppRole;
  avatarUrl?: string | null;
  company?: string | null;
  phone?: string | null;
};

export type UpdateUserInput = {
  email?: string;
  fullName?: string;
  avatarUrl?: string | null;
  company?: string | null;
  phone?: string | null;
  role?: AppRole;
  isActive?: boolean;
};

export class UserServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'UserServiceError';
    this.status = status;
  }
}

function mapUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    company: user.company,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

async function ensureEmailAvailable(email: string, ignoredUserId?: string) {
  const existingUser = await withTemporaryDatabaseRetry(() =>
    prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    }),
  );

  if (existingUser && existingUser.id !== ignoredUserId) {
    throw new UserServiceError('Este email ja esta cadastrado.', 409);
  }
}

export async function listUsers() {
  const users = await withTemporaryDatabaseRetry(() =>
    prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    }),
  );

  return users.map(mapUser);
}

export async function createUser(input: CreateUserInput) {
  const email = input.email.trim().toLowerCase();
  await ensureEmailAvailable(email);

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await withTemporaryDatabaseRetry(() =>
    prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: input.fullName.trim(),
        avatarUrl: input.avatarUrl ?? null,
        company: input.company ?? null,
        phone: input.phone ?? null,
        role: input.role,
      },
    }),
  );

  return mapUser(user);
}

export async function updateUser(userId: string, input: UpdateUserInput) {
  if (input.email) {
    await ensureEmailAvailable(input.email.trim().toLowerCase(), userId);
  }

  try {
    const user = await withTemporaryDatabaseRetry(() =>
      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          email: input.email?.trim().toLowerCase(),
          fullName: input.fullName?.trim(),
          avatarUrl: input.avatarUrl,
          company: input.company,
          phone: input.phone,
          role: input.role,
          isActive: input.isActive,
        },
      }),
    );

    return mapUser(user);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      throw new UserServiceError('Usuario nao encontrado.', 404);
    }

    throw error;
  }
}

export async function deactivateUser(userId: string) {
  return updateUser(userId, {
    isActive: false,
  });
}
