import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { providerUpdates, updateProviders } from '../prisma/provider-update.mjs';
import { calculate } from '../lib/pricing';

test('sąlygų atnaujinimas pasiekia esamą DB, išsaugo paskesnius redagavimus ir nekuria kainos iš pavyzdžio', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'providers-'));
  const url = `file:${path.join(dir, 'site.db')}`;
  const db = new PrismaClient({ datasources: { db: { url } } });
  try {
    const result = spawnSync(process.execPath, ['scripts/prepare-runtime.mjs'], {
      env: { ...process.env, DATABASE_URL: url },
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr);
    // Simulate an existing installation with old seed already applied.
    await db.seedState.delete({ where: { key: 'provider-conditions-2026-10-22-v1' } });
    await db.creditor.updateMany({ data: { amountMax: 5000, example: null } });
    await updateProviders(db);
    const rows = await db.creditor.findMany();
    assert.equal(rows.length, 6);
    for (const expected of providerUpdates) {
      const row = rows.find((c) => c.slug === expected.slug)!;
      assert.equal(row.amountMax, expected.amountMax);
      assert.equal(row.termMax, expected.termMax);
      assert.equal(row.example, expected.example);
      assert.equal(row.applyUrl, expected.sourceUrl);
      assert.equal(calculate(row, 3000, 24), null);
      assert.equal(row.rating, null);
    }
    assert.equal(rows.find((c) => c.slug === 'vivus')!.amountMin, null);
    assert.equal(rows.find((c) => c.slug === 'bobutes-paskola')!.termMin, null);
    assert.match(rows.find((c) => c.slug === 'finbee')!.example!, /940/);
    await db.creditor.update({
      where: { slug: 'credit24' },
      data: { summary: 'Vėlesnė redakcija' },
    });
    await updateProviders(db);
    assert.equal(
      (await db.creditor.findUniqueOrThrow({ where: { slug: 'credit24' } })).summary,
      'Vėlesnė redakcija',
    );
  } finally {
    await db.$disconnect();
    rmSync(dir, { recursive: true, force: true });
  }
});
