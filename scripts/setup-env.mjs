import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
if (!existsSync('.env')) {
  const example = readFileSync('.env.example', 'utf8');
  writeFileSync(
    '.env',
    example.replace('NEXTAUTH_SECRET=""', `NEXTAUTH_SECRET="${randomBytes(32).toString('hex')}"`),
    { mode: 0o600, flag: 'wx' },
  );
  console.log('Sukurta vietinė .env su atsitiktine sesijos paslaptimi.');
} else console.log('Esama .env išsaugota.');
