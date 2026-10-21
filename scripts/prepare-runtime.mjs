import { runCommand } from './run-command.mjs';
import { createRequire } from 'node:module';
import path from 'node:path';
import './ensure-db.mjs';

const require = createRequire(import.meta.url);
console.log('[database] Preparing migrations and initial content.');
runCommand('migrate', process.execPath, [
  require.resolve('prisma/build/index.js'),
  'migrate',
  'deploy',
]);
runCommand('seed', process.execPath, [path.resolve('prisma/seed.mjs'), '--once']);
console.log('[database] Ready. Existing records preserved.');
