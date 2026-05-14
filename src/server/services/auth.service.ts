import type { AppRole, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { signAuthToken } from '../auth/jwt';
import { prisma } from '../db/prisma';
import { withTemporaryDatabaseRetry } from '../db/prisma-retry';

type UserWithSafeFields = Pick<
  User,
  'id' | 'email' | 'fullName' | 'avatarUrl' | 'company' | 'phone' | 'role' | 'isActive'
>;

export type SafeAuthUser = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  company: string | null;
  phone: string | null;
  role: AppRole;
  isActive: boolean;
};

export type LoginResult =
  | {
      status: 'ok';
      token: string;
      user: SafeAuthUser;
    }
  | {
      status: 'invalid_credentials' | 'inactive_user';
    };

const safeUserSelect = {
  id: true,
  email: true,
  fullName: true,
  avatarUrl: true,
  company: true,
  phone: true,
  role: true,
  isActive: true,
} as const;

function toSafeUser(user: UserWithSafeFields): SafeAuthUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    company: user.company,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
  };
}

export async function loginWithPassword(email: string, password: string): Promise<LoginResult> {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await withTemporaryDatabaseRetry(() =>
    prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        ...safeUserSelect,
        passwordHash: true,
      },
    }),
  );

  if (!user) {
    return { status: 'invalid_credentials' };
  }

  if (!user.isActive) {
    return { status: 'inactive_user' };
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return { status: 'invalid_credentials' };
  }

  const safeUser = toSafeUser(user);
  const token = signAuthToken({
    sub: safeUser.id,
    email: safeUser.email,
    role: safeUser.role,
  });

  return {
    status: 'ok',
    token,
    user: safeUser,
  };
}

export async function getSafeUserById(userId: string) {
  const user = await withTemporaryDatabaseRetry(() =>
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: safeUserSelect,
    }),
  );

  return user ? toSafeUser(user) : null;
}
