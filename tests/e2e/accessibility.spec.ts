import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('pagrindinio ir palyginimo WCAG A/AA automatizuotos patikros', async ({ page }) => {
  for (const path of ['/', '/palyginimas', '/admin/prisijungti']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    const dark = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(dark.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
      [],
    );
  }
});
