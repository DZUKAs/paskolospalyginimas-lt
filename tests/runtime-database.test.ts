import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
import { resolveDatabaseUrl } from '../scripts/database-url.mjs';

test('SQLite URL kelias nepriklauso nuo sugeneruoto Prisma kliento vietos', () => {
  assert.equal(
    resolveDatabaseUrl('file:./dev.db', '/app/release'),
    'file:/app/release/prisma/dev.db',
  );
  assert.equal(
    resolveDatabaseUrl('file:/data/paskolos.db', '/app/release'),
    'file:/data/paskolos.db',
  );
  assert.throws(() => resolveDatabaseUrl('postgresql://example.test/db'));
});

test('tuščia serverio DB inicializuojama, pakartotinis paleidimas išsaugo redaguotą turinį', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'paskolos-runtime-'));
  const filename = path.join(dir, 'data', 'site.db');
  try {
    const boot = () =>
      spawnSync(process.execPath, ['scripts/prepare-runtime.mjs'], {
        cwd: process.cwd(),
        env: { ...process.env, DATABASE_URL: `file:${filename}` },
        encoding: 'utf8',
        timeout: 60000,
      });
    const first = boot();
    assert.equal(first.status, 0, first.stderr + first.stdout);
    const db = new DatabaseSync(filename);
    try {
      assert.equal(db.prepare('SELECT COUNT(*) AS count FROM Creditor').get()!.count, 6);
      assert.equal(db.prepare('SELECT COUNT(*) AS count FROM Article').get()!.count, 6);
      assert.equal(db.prepare('SELECT COUNT(*) AS count FROM User').get()!.count, 0);
      db.prepare('UPDATE Creditor SET summary=? WHERE slug=?').run(
        'Administratoriaus pakeistas tekstas',
        'credit24',
      );
    } finally {
      db.close();
    }
    const again = boot();
    assert.equal(again.status, 0, again.stderr + again.stdout);
    const reopened = new DatabaseSync(filename);
    try {
      assert.equal(
        reopened.prepare('SELECT summary FROM Creditor WHERE slug=?').get('credit24')!.summary,
        'Administratoriaus pakeistas tekstas',
      );
      assert.equal(reopened.prepare('SELECT COUNT(*) AS count FROM Creditor').get()!.count, 6);
      assert.equal(reopened.prepare('SELECT COUNT(*) AS count FROM Article').get()!.count, 6);
      reopened
        .prepare('DELETE FROM Article WHERE slug = ?')
        .run('greita-paskola-kaip-pasirinkti-geriausia-varianta-internetu');
    } finally {
      reopened.close();
    }
    const third = boot();
    assert.equal(third.status, 0, third.stderr + third.stdout);
    const finalDb = new DatabaseSync(filename);
    try {
      assert.equal(finalDb.prepare('SELECT COUNT(*) AS count FROM Article').get()!.count, 5);
    } finally {
      finalDb.close();
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
