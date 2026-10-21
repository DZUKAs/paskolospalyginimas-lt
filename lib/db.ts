import { PrismaClient } from '@prisma/client';
import { resolveDatabaseUrl } from '../scripts/database-url.mjs';
const globalDb = globalThis as unknown as { prisma?: PrismaClient };
export const db =
  globalDb.prisma ?? new PrismaClient({ datasources: { db: { url: resolveDatabaseUrl() } } });
if (process.env.NODE_ENV !== 'production') globalDb.prisma = db;
