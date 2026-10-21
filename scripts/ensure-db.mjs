import { existsSync, mkdirSync, openSync, closeSync } from 'node:fs';
import path from 'node:path';
import { resolveDatabaseUrl } from './database-url.mjs';

process.env.DATABASE_URL = resolveDatabaseUrl();
const filename = process.env.DATABASE_URL.slice(5).split('?')[0];
mkdirSync(path.dirname(filename), { recursive: true });
// Never truncate or replace an existing database.
if (!existsSync(filename)) closeSync(openSync(filename, 'ax', 0o600));
