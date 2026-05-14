import 'dotenv/config';

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const saltRounds = 12;

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} e obrigatorio.`);
  }

  return value;
}

async function main() {
  const email = requiredEnv('ADMIN_EMAIL').toLowerCase();
  const password = requiredEnv('ADMIN_PASSWORD');
  const fullName = requiredEnv('ADMIN_FULL_NAME');
  const company = process.env.ADMIN_COMPANY?.trim() || null;
  const phone = process.env.ADMIN_PHONE?.trim() || null;
  const avatarUrl = process.env.ADMIN_AVATAR_URL?.trim() || null;

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD deve ter pelo menos 8 caracteres.');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (existingUser) {
    console.log(`Usuario ${existingUser.email} ja existe com role ${existingUser.role}. Nenhum usuario foi criado.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName,
      company,
      phone,
      avatarUrl,
      role: 'admin',
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  console.log(`Usuario admin criado com sucesso: ${user.email} (${user.id})`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : 'Erro ao criar usuario admin.');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
