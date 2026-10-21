import { existsSync, mkdirSync, openSync, closeSync } from 'node:fs';
import path from 'node:path';
if (existsSync('.env')) process.loadEnvFile('.env');
const url = process.env.DATABASE_URL;
if (!url?.startsWith('file:'))
  throw new Error('Šiai konfigūracijai reikia SQLite DATABASE_URL=file:...');
const name = decodeURIComponent(url.slice(5).split('?')[0]);
const filename = path.isAbsolute(name) ? name : path.resolve('prisma', name);
mkdirSync(path.dirname(filename), { recursive: true });
// Prisma 6 engine on this runtime needs an existing file before migrate deploy.
if (!existsSync(filename)) closeSync(openSync(filename, 'ax', 0o600));
