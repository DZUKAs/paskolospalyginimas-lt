import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { randomBytes, createHash } from 'node:crypto';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { hashPassword } from '../../lib/password';
const db = new PrismaClient();
const uploaded: string[] = [];
const password = randomBytes(24).toString('base64url');
const email = 'e2e-' + randomBytes(5).toString('hex') + '@example.invalid';
const editorEmail = 'editor-' + email;
const tag = 'e2e-' + randomBytes(5).toString('hex');
test.beforeAll(async () => {
  for (const [e, role] of [
    [email, 'ADMIN'],
    [editorEmail, 'EDITOR'],
  ])
    await db.user.create({ data: { email: e, passwordHash: await hashPassword(password), role } });
});
test.afterAll(async () => {
  const users = await db.user.findMany({ where: { email: { in: [email, editorEmail] } } });
  await db.auditLog.deleteMany({ where: { userId: { in: users.map((u) => u.id) } } });
  await db.user.deleteMany({ where: { email: { in: [email, editorEmail] } } });
  await db.article.deleteMany({ where: { slug: { startsWith: tag } } });
  await db.creditor.deleteMany({ where: { slug: tag } });
  await db.loginAttempt.deleteMany({
    where: {
      key: { in: [email, editorEmail].map((e) => createHash('sha256').update(e).digest('hex')) },
    },
  });
  for (const filename of uploaded)
    await unlink(path.join(process.cwd(), 'data/uploads', filename)).catch(() => {});
  await db.$disconnect();
});
async function login(page: import('@playwright/test').Page, asEditor = false) {
  await page.goto('/admin/prisijungti');
  await page.getByLabel('El. paštas', { exact: true }).fill(asEditor ? editorEmail : email);
  await page.getByLabel('Slaptažodis', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Prisijungti →' }).click();
  await expect(page).toHaveURL(/\/admin$/);
}
test('administratorius sukuria, publikuoja, redaguoja ir ištrina straipsnį', async ({
  page,
  request,
}) => {
  await login(page);
  await page.getByRole('link', { name: 'Naujas straipsnis +' }).click();
  await page.getByLabel('Pavadinimas', { exact: true }).fill('Bandomasis straipsnis');
  await page.getByLabel('Slug (esamas adresas išsaugomas)').fill(tag + '-article');
  await page.getByLabel('Trumpas aprašymas').fill('Tik testavimui skirtas straipsnio aprašymas.');
  await page.locator('.tiptap').fill('Saugus bandomojo straipsnio turinys.');
  await page.getByRole('button', { name: 'Išsaugoti straipsnį' }).click();
  await expect(page).toHaveURL(/tab=naujienos/);
  expect((await request.get('/naujienos/' + tag + '-article')).status()).toBe(404);
  const a = await db.article.findUniqueOrThrow({ where: { slug: tag + '-article' } });
  await page.goto('/admin/straipsniai/' + a.id);
  await page.getByRole('combobox', { name: /Būsena/ }).selectOption('PUBLISHED');
  await page.getByLabel('Publikavimo data (UTC)').fill('2026-01-01T12:00');
  await page.getByRole('button', { name: 'Išsaugoti straipsnį' }).click();
  await expect(page).toHaveURL(/tab=naujienos/);
  const publicResult = await request.get('/naujienos/' + tag + '-article');
  expect(publicResult.status()).toBe(200);
  expect(await publicResult.text()).toContain('Saugus bandomojo');
  await page.goto('/admin/straipsniai/' + a.id);
  await page.getByLabel('Pavadinimas', { exact: true }).fill('Pakeistas bandomasis straipsnis');
  await page.getByRole('button', { name: 'Išsaugoti straipsnį' }).click();
  await expect(page).toHaveURL(/tab=naujienos/);
  page.once('dialog', (d) => d.accept());
  await page
    .locator('.admin-row')
    .filter({ hasText: 'Pakeistas bandomasis straipsnis' })
    .getByRole('button', { name: 'Ištrinti' })
    .click();
  await expect(page.getByText('Pakeistas bandomasis straipsnis', { exact: true })).toHaveCount(0);
  expect((await request.get('/naujienos/' + tag + '-article')).status()).toBe(404);
});
test('redaktorius negali valdyti kreditorių', async ({ page }) => {
  await login(page, true);
  await expect(page.getByRole('link', { name: 'Kreditoriai', exact: true })).toHaveCount(0);
  await page.goto('/admin/kreditoriai/naujas');
  await expect(page).toHaveURL(/\/admin$/);
});
test('suplanuotas straipsnis viešas tik suėjus laikui', async ({ request }) => {
  const a = await db.article.create({
    data: {
      slug: tag + '-scheduled',
      title: 'Testinė suplanuota publikacija',
      excerpt: 'Skirta suplanuoto publikavimo patikrai.',
      bodyHtml: '<p>Bandomoji publikacija</p>',
      category: 'Testai',
      author: 'Testas',
      status: 'SCHEDULED',
      publishedAt: new Date(Date.now() + 86400000),
    },
  });
  expect((await request.get('/naujienos/' + a.slug)).status()).toBe(404);
  await db.article.update({
    where: { id: a.id },
    data: { publishedAt: new Date(Date.now() - 1000) },
  });
  expect((await request.get('/naujienos/' + a.slug)).status()).toBe(200);
});
test('administratorius prideda kreditorių ir įkelia paveikslėlį', async ({ page }) => {
  await login(page);
  await page.goto('/admin/kreditoriai/naujas');
  await page.getByLabel('Slug (be „-apzvalga“)').fill(tag);
  await page.getByLabel('Pavadinimas', { exact: true }).fill('Testinis kreditorius');
  await page.getByLabel('Trumpa antraštė').fill('Bandomosios sąlygos');
  await page.getByLabel('Informacijos šaltinio HTTPS nuoroda').fill('https://example.com');
  await page
    .getByLabel('Santrauka', { exact: true })
    .fill('Bandomasis kreditorius, skirtas tik funkciniam testui.');
  await page
    .getByLabel('Įkelti paveikslėlį (JPG, PNG, WebP iki 5 MB)')
    .setInputFiles('public/images/gidas.webp');
  await expect(page.getByLabel('Logotipo adresas')).toHaveValue(/\/uploads\/.*\.webp/);
  const uploadUrl = await page.getByLabel('Logotipo adresas').inputValue();
  uploaded.push(uploadUrl.split('/').at(-1)!);
  const uploadedImage = await page.request.get(uploadUrl);
  expect(uploadedImage.status()).toBe(200);
  expect(uploadedImage.headers()['content-type']).toBe('image/webp');
  await page.getByRole('button', { name: 'Išsaugoti kreditorių' }).click();
  await expect(page).toHaveURL(/tab=kreditoriai/);
  await expect(page.getByText('Testinis kreditorius', { exact: true })).toBeVisible();
  await page.goto(`/loans/${tag}-apzvalga/`);
  await expect(page.locator('h1')).toContainText('Testinis kreditorius');
});
