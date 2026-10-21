import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate } from '../lib/pricing';
import { cleanHtml, jsonLd } from '../lib/content';
const valid = {
  pricingVerified: true,
  verifiedAt: new Date(),
  annualRate: 12,
  apr: 15,
  monthlyFee: 2,
  originationPercent: 1,
  example: 'Testinis pavyzdys, ne kreditoriaus pasiūlymas.',
  amountMin: 50,
  amountMax: 10000,
  termMin: 1,
  termMax: 84,
};
test('nepatvirtinta ir nepilna kainodara neskaičiuojama', () => {
  assert.equal(calculate({ ...valid, pricingVerified: false }, 1000, 12), null);
  assert.equal(calculate({ ...valid, apr: null }, 1000, 12), null);
  assert.equal(calculate({ ...valid, example: null }, 1000, 12), null);
  assert.equal(calculate({ ...valid, verifiedAt: null }, 1000, 12), null);
});
test('anuitetas apima mėnesinį ir pradinį mokestį', () => {
  const result = calculate(valid, 1000, 12)!;
  assert.ok(Math.abs(result.monthly - 90.848788678) < 0.00001);
  assert.ok(Math.abs(result.total - 1100.185464136) < 0.00001);
  assert.equal(result.upfront, 10);
});
test('0 procentų modelis neskirsto iš nulio', () => {
  assert.equal(
    calculate({ ...valid, annualRate: 0, monthlyFee: 0, originationPercent: 0, apr: 0 }, 1200, 12)!
      .total,
    1200,
  );
});
test('ribos ir negaliojančios įvestys atmetamos', () => {
  for (const [a, m] of [
    [10, 12],
    [1000, 0],
    [1000, 1.2],
    [NaN, 12],
    [1000, Infinity],
    [10001, 12],
  ])
    assert.equal(calculate(valid, a, m), null);
});
test('turinys išvalo XSS ir nesaugias nuorodas', () => {
  const html = cleanHtml(
    '<p onclick="alert(1)">Sveiki</p><script>alert(1)</script><a href="javascript:alert(1)">x</a><img src=x onerror=alert(1)>',
  );
  assert.ok(!html.includes('onclick'));
  assert.ok(!html.includes('<script'));
  assert.ok(!html.includes('javascript:'));
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('Sveiki'));
});
test('JSON-LD neleidžia uždaryti script elemento', () => {
  assert.ok(!jsonLd({ title: '</script><script>alert(1)</script>' }).includes('<'));
});
