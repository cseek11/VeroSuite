import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

/**
 * Get singleton Prisma client for tests
 * Prevents connection pool exhaustion
 */
export function getTestPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 
               'postgresql://postgres:postgres@localhost:5432/verofield_ci'
        }
      },
      log: ['error'], // Only log errors to reduce noise
    });
  }
  return prisma;
}

/**
 * Disconnect Prisma client
 * Called by global teardown
 */
export async function cleanupTestDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}

