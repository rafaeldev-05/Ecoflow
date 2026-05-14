import type { AppRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        fullName: string;
        avatarUrl: string | null;
        company: string | null;
        phone: string | null;
        role: AppRole;
        isActive: boolean;
      };
    }
  }
}

export {};
