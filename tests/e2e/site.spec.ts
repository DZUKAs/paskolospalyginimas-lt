import { test, expect } from '@playwright/test';
test('skaičiuoklė, filtrai ir palyginimas greta', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Tik būtinieji' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Jūsų pasirinkimas');
  await page.getByRole('link', { name: 'Palyginti galimybes' }).click();
  await expect(page).toHaveURL(/suma=3000&terminas=24/);
  await expect(page.locator('.status-line')).toContainText('6 kreditoriai');
  await page.getByLabel('Pirmoji paskola 0 %').check();
  await expect(page.locator('.status-line')).toContainText('0 kreditoriai');
  await page.getByLabel('Pirmoji paskola 0 %').uncheck();
  await page.getByRole('checkbox', { name: 'Lyginti Credit24', exact: true }).first().check();
  await page.getByRole('checkbox', { name: 'Lyginti Finbee', exact: true }).first().check();
  await page.getByRole('button', { name: 'Palyginti greta' }).click();
  await expect(page.getByRole('region', { name: 'Kreditoriai greta' })).toContainText('Credit24');
});
test('visos šešios apžvalgos ir metaduomenys', async ({ page }) => {
  for (const slug of ['credit24', 'savy', 'vivus', 'finbee', 'bobutes-paskola', 'smspinigai']) {
    const response = await page.goto(`/loans/${slug}-apzvalga/`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('sąlygos');
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', new RegExp(slug));
    expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(1);
  }
});
test('naujienų paieška ir straipsnis', async ({ page }) => {
  await page.goto('/naujienos');
  await page.getByRole('button', { name: 'Tik būtinieji' }).click();
  await page.getByLabel('Ieškoti straipsnių').fill('valiuta-neegzistuoja');
  await page.getByRole('button', { name: /^Ieškoti/ }).click();
  await expect(page.getByRole('main').getByRole('status')).toContainText('Straipsnių');
  await page.goto('/naujienos');
  await page.locator('.article-card a').first().click();
  await expect(page.locator('.prose h1')).toBeVisible();
  await expect(page.getByText('Dalintis:', { exact: true })).toBeVisible();
});
test('senas straipsnis nukreipiamas 301, administratorius apsaugotas', async ({
  request,
  page,
}) => {
  const response = await request.get(
    '/greita-paskola-kaip-pasirinkti-geriausia-varianta-internetu',
    { maxRedirects: 0 },
  );
  expect(response.status()).toBe(301);
  expect(response.headers().location).toBe(
    '/naujienos/greita-paskola-kaip-pasirinkti-geriausia-varianta-internetu',
  );
  await page.goto('/admin');
  await expect(page).toHaveURL(/prisijungti/);
  const upload = await request.post('/api/upload', { headers: { origin: 'https://evil.example' } });
  expect(upload.status()).toBe(403);
  expect((await request.get('/tikrai-nera')).status()).toBe(404);
});
test('mobilioji navigacija, kortelės, tema ir turinio ribos', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Tik būtinieji' }).click();
  await page.getByRole('button', { name: 'Meniu', exact: true }).click();
  await page
    .getByRole('navigation', { name: 'Pagrindinė navigacija' })
    .getByRole('link', { name: 'Palyginti paskolas' })
    .click();
  await expect(page.locator('.comparison-mobile')).toBeVisible();
  await expect(page.locator('.table-wrap.desktop')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('button', { name: 'Įjungti tamsią temą' }).click();
  await expect(page.locator('html')).toHaveClass('dark');
  await page.reload();
  await expect(page.locator('html')).toHaveClass('dark');
});

test('neautorizuotas paveikslėlio įkėlimas atmetamas ir robots saugo peržiūrą', async ({
  request,
}) => {
  const r = await request.post('/api/upload', { headers: { origin: 'http://localhost:3000' } });
  expect(r.status()).toBe(401);
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Disallow: /');
  const sitemap = await request.get('/sitemap.xml');
  expect(await sitemap.text()).toContain('/loans/credit24-apzvalga/');
});
