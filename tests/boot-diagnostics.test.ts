import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runCommand } from '../scripts/run-command.mjs';

test('paleidimo klaida išlaiko tikrą child stderr ir statusą, paslaptį pašalina', () => {
  const secret = 'sensitive-test-value-123';
  assert.throws(
    () =>
      runCommand(
        'test',
        process.execPath,
        [
          '-e',
          "console.error('EACCES: permission denied '+process.env.NEXTAUTH_SECRET);process.exit(7)",
        ],
        { ...process.env, NEXTAUTH_SECRET: secret },
      ),
    (error) => {
      assert.ok(error instanceof Error);
      assert.ok(error.message.includes('status=7'));
      assert.ok(error.message.includes('EACCES: permission denied'));
      assert.ok(error.message.includes('[REDACTED]'));
      assert.ok(!error.message.includes(secret));
      return true;
    },
  );
});
test('kai paruošimas nutrūksta dar prieš migracijas, tiksli priežastis matoma Next klaidoje', () => {
  assert.throws(
    () =>
      runCommand('bootstrap', process.execPath, ['scripts/prepare-runtime.mjs'], {
        ...process.env,
        DATABASE_URL: 'unsupported://test',
      }),
    /DATABASE_URL turi būti SQLite file: adresas/,
  );
});
