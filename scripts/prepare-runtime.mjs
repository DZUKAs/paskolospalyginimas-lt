import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import './ensure-db.mjs';

const require = createRequire(import.meta.url);
console.log('[database] Preparing migrations and initial content.');
execFileSync(process.execPath, [require.resolve('prisma/build/index.js'), 'migrate', 'deploy'], {
  stdio: 'inherit',
  env: process.env,
});
execFileSync(process.execPath, [path.resolve('prisma/seed.mjs'), '--once'], {
  stdio: 'inherit',
  env: process.env,
});
console.log('[database] Ready. Existing records preserved.');
