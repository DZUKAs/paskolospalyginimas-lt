import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { hashPassword, verifyPassword } from '../lib/password';
import { consumeAttempt } from '../lib/auth';
import { db } from '../lib/db';
test('slaptažodžiai turi atskirą salt, teisingą ir klaidingą patikrą', async () => {
  const a = await hashPassword('Testinis-slaptažodis-123!'),
    b = await hashPassword('Testinis-slaptažodis-123!');
  assert.notEqual(a, b);
  assert.ok(await verifyPassword('Testinis-slaptažodis-123!', a));
  assert.equal(await verifyPassword('neteisingas', a), false);
});
test('bandymų limitas išlieka DB ir atsinaujina tik po intervalo', async () => {
  const key = 'test-' + randomUUID();
  try {
    for (let i = 0; i < 5; i++) assert.equal(await consumeAttempt(key), true);
    assert.equal(await consumeAttempt(key), false);
    await db.loginAttempt.update({
      where: { key },
      data: { windowStart: new Date(Date.now() - 16 * 60 * 1000) },
    });
    assert.equal(await consumeAttempt(key), true);
  } finally {
    await db.loginAttempt.delete({ where: { key } });
    await db.$disconnect();
  }
});
