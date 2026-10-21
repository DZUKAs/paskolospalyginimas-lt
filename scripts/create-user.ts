import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/password';
import { parseArgs } from 'node:util';
import { createInterface } from 'node:readline/promises';
async function main() {
  const args = parseArgs({
    options: { email: { type: 'string' }, role: { type: 'string', default: 'ADMIN' } },
  }).values;
  const email = args.email?.trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email) || !['ADMIN', 'EDITOR'].includes(args.role!))
    throw new Error(
      'Naudojimas: npm run admin:create -- --email jusu@adresas.lt --role ADMIN|EDITOR',
    );
  let password = process.env.ADMIN_PASSWORD;
  if (!password) {
    if (!process.stdin.isTTY)
      throw new Error('Nustatykite ADMIN_PASSWORD saugioje terminalo aplinkoje.');
    const readline = createInterface({ input: process.stdin, output: process.stdout });
    console.log('Slaptažodį pateikite per ADMIN_PASSWORD (nenaudokite komandos argumento).');
    readline.close();
    throw new Error('Trūksta ADMIN_PASSWORD.');
  }
  if (password.length < 14 || password.length > 256)
    throw new Error('Slaptažodis turi būti 14–256 simbolių.');
  const db = new PrismaClient();
  try {
    await db.user.create({
      data: { email, role: args.role!, passwordHash: await hashPassword(password) },
    });
    console.log('Paskyra sukurta.');
  } finally {
    await db.$disconnect();
    password = '';
  }
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
