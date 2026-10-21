import { existsSync } from 'node:fs';
import path from 'node:path';

if (existsSync('.env')) process.loadEnvFile('.env');

/**
 * Resolve SQLite locations against the repository's schema directory, rather
 * than a generated Prisma client's location inside a deployment artifact.
 * @param {string | undefined} url
 * @param {string} root
 */
export function resolveDatabaseUrl(url = process.env.DATABASE_URL, root = process.cwd()) {
  if (!url?.startsWith('file:')) {
    throw new Error('DATABASE_URL turi būti SQLite file: adresas.');
  }
  const queryAt = url.indexOf('?');
  const name = decodeURIComponent(url.slice(5, queryAt === -1 ? undefined : queryAt));
  if (!name || name === ':memory:') throw new Error('DATABASE_URL reikia duomenų bazės failo.');
  const filename = path.isAbsolute(name) ? name : path.resolve(root, 'prisma', name);
  return `file:${filename}${queryAt === -1 ? '' : url.slice(queryAt)}`;
}
