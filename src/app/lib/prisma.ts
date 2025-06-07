import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Cria uma instância única do PrismaClient
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // log das queries no console (opcional)
  });

// Guarda a instância global para evitar múltiplas conexões no hot reload do Next.js
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
