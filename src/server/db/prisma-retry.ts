import { Prisma } from '@prisma/client';

const transientDatabaseMessages = [
  'ConnectionReset',
  'Server has closed the connection',
  'Can\'t reach database server',
  'Connection terminated',
];

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function isTemporaryDatabaseError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P1017') {
    return true;
  }

  if (!(error instanceof Error)) {
    return false;
  }

  const errorText = `${error.name} ${error.message}`;

  return transientDatabaseMessages.some((message) => errorText.includes(message));
}

export async function withTemporaryDatabaseRetry<T>(operation: () => Promise<T>) {
  try {
    return await operation();
  } catch (error) {
    if (!isTemporaryDatabaseError(error)) {
      throw error;
    }

    await wait(150);
    return operation();
  }
}
