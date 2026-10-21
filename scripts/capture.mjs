import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
  headless: true,
});
await mkdir('docs/screenshots', { recursive: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
await page.addInitScript(() =>
  localStorage.setItem('cookie-consent', '{"necessary":true,"analytics":false}'),
);
await page.goto('http://localhost:3000');
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all(
    [...document.images].map(async (img) => {
      img.loading = 'eager';
      await img.decode().catch(() => {});
    }),
  );
});
await page.screenshot({ path: 'docs/screenshots/pradzia.png', fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.reload();
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all(
    [...document.images].map(async (img) => {
      img.loading = 'eager';
      await img.decode().catch(() => {});
    }),
  );
});
await page.screenshot({ path: 'docs/screenshots/mobilus.png', fullPage: true });
await page.getByRole('button', { name: 'Įjungti tamsią temą' }).click();
await page.screenshot({ path: 'docs/screenshots/tamsi-tema.png', fullPage: true });
await browser.close();
