import 'dotenv/config';

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const saltRounds = 12;

function readCliArg(name: string) {
  const prefix = `--${name}=`;
  const arg = process.argv.slice(2).find((value) => value.startsWith(prefix));

  return arg?.slice(prefix.length).trim();
}

function readInput(envName: string, cliName: string) {
  return readCliArg(cliName) || process.env[envName]?.trim();
}

function requiredInput(envName: string, cliName: string) {
  const value = readInput(envName, cliName);

  if (!value) {
    throw new Error(`${envName} ou --${cliName}=... e obrigatorio.`);
  }

  return value;
}

function isExplicitlyEnabled(envName: string, cliName: string) {
  return process.argv.includes(`--${cliName}`) || process.env[envName]?.trim().toLowerCase() === 'true';
}

async function main() {
  const email = requiredInput('ADMIN_EMAIL', 'email').toLowerCase();
  const password = requiredInput('ADMIN_PASSWORD', 'password');
  const fullName = requiredInput('ADMIN_FULL_NAME', 'full-name');
  const company = process.env.ADMIN_COMPANY?.trim() || null;
  const phone = process.env.ADMIN_PHONE?.trim() || null;
  const avatarUrl = process.env.ADMIN_AVATAR_URL?.trim() || null;
  const promoteExisting = isExplicitlyEnabled('ADMIN_PROMOTE_EXISTING', 'promote-existing');

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD deve ter pelo menos 8 caracteres.');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (existingUser) {
    if (!promoteExisting) {
      console.log(
        `Usuario ${existingUser.email} ja existe com role ${existingUser.role}. Nenhum usuario foi criado ou atualizado.`,
      );
      console.log('Para promover explicitamente para admin, use ADMIN_PROMOTE_EXISTING=true ou --promote-existing.');
      return;
    }

    const promotedUser = await prisma.user.update({
      where: { email },
      data: {
        role: 'admin',
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    console.log(`Usuario existente promovido para admin com sucesso: ${promotedUser.email} (${promotedUser.id})`);
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
