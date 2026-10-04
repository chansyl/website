import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.TEST_URL || 'http://127.0.0.1:4173/website/xingren-yian/';
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || 'chrome',
  headless: true,
});
const evidence = 'artifacts/qa';
await mkdir(evidence, { recursive: true });
const errors = [];
const checks = [];
try {
  for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
      permissions: ['clipboard-read', 'clipboard-write'],
    });
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(`${width}: ${e.message}`));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(`${width}: ${m.text()} at ${m.location().url}`);
    });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${evidence}/home-${width}.png`, fullPage: true });
    const overflow = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    assert.ok(
      overflow.scroll <= overflow.width,
      `Horizontal overflow ${width}: ${JSON.stringify(overflow)}`,
    );
    assert.ok(await page.locator('h1').isVisible());
    assert.ok(await page.locator('[data-primary-cta]').isVisible());
    if (width < 768) {
      await page.getByRole('button', { name: '打开导航菜单' }).click();
      await page.getByRole('dialog').waitFor({ state: 'visible' });
      await page.screenshot({ path: `${evidence}/menu-${width}.png` });
      await page.keyboard.press('Escape');
      assert.equal(
        await page.getByRole('button', { name: '打开导航菜单' }).getAttribute('aria-expanded'),
        'false',
      );
      await page.getByRole('button', { name: '打开导航菜单' }).click();
      await page
        .getByRole('navigation', { name: '手机导航' })
        .getByRole('link', { name: /双端体验/ })
        .click();
      assert.equal(await page.getByRole('dialog').isVisible(), false);
    }
    await page.getByRole('button', { name: '手机体验', exact: true }).click();
    assert.equal(
      await page
        .getByRole('button', { name: '手机体验', exact: true })
        .getAttribute('aria-pressed'),
      'true',
    );
    await page.getByRole('button', { name: '了解我们的服务', exact: true }).click();
    assert.ok(await page.getByRole('heading', { name: /你的业务，/ }).isVisible());
    await page.getByRole('button', { name: '电脑体验', exact: true }).click();
    assert.equal(
      await page
        .getByRole('button', { name: '电脑体验', exact: true })
        .getAttribute('aria-pressed'),
      'true',
    );
    await page.locator('#experience').screenshot({ path: `${evidence}/experience-${width}.png` });
    await page.locator('.process-step summary').first().click();
    assert.equal(await page.locator('.process-step').first().getAttribute('open'), '');
    if (width < 768) {
      await page.locator('#process').scrollIntoViewIfNeeded();
      assert.ok(await page.getByRole('complementary', { name: '快速咨询' }).isVisible());
    }
    for (const slug of ['corporate-website', 'custom-web', 'app', 'mini-program']) {
      await page.goto(`${base}services/${slug}/`, { waitUntil: 'networkidle' });
      assert.ok(await page.locator('h1').isVisible());
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `Service overflow ${slug} at ${width}`,
      );
      await page.locator('.faq-list summary').first().click();
      assert.equal(await page.locator('.faq-list details').first().getAttribute('open'), '');
    }
    await page.locator('[data-primary-cta]').click();
    await page.waitForURL('**/contact/?service=mini-program');
    assert.equal(
      await page.getByRole('radio', { name: '小程序开发', exact: true }).isChecked(),
      true,
    );
    await page.getByRole('button', { name: '整理我的需求', exact: true }).click();
    assert.equal(await page.locator('#needs').evaluate((e) => e.validity.valueMissing), true);
    await page.locator('#company').fill('示例企业（验收测试）');
    await page.locator('#needs').fill('希望展示产品和服务，电脑和手机都能顺畅浏览。');
    await page.locator('#timeline').selectOption({ label: '1–3 个月' });
    await page.locator('#contact').fill('test@example.com');
    await page.getByRole('button', { name: '整理我的需求', exact: true }).click();
    const summary = await page.getByRole('textbox', { name: '需求摘要，可编辑' }).inputValue();
    assert.match(summary, /小程序开发/);
    assert.match(summary, /示例企业/);
    assert.match(summary, /test@example.com/);
    assert.ok(
      (await page.getByRole('link', { name: '通过邮件发送' }).getAttribute('href')).startsWith(
        'mailto:chansyl8187@gmail.com?',
      ),
    );
    await page.getByRole('button', { name: '复制摘要' }).click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), summary);
    await page.screenshot({ path: `${evidence}/contact-${width}.png`, fullPage: true });
    assert.ok(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `Contact overflow at ${width}`,
    );
    checks.push({ width, passed: true });
    await context.close();
  }
  assert.deepEqual(errors, [], 'Browser console errors');
  const response = await fetch(`${base}unknown-page/`);
  assert.equal(response.status, 404);
  await writeFile(
    `${evidence}/result.json`,
    JSON.stringify({ base, checks, errors, unknownRoute: 404 }, null, 2),
  );
  console.log(JSON.stringify({ checks, errors, unknownRoute: 404 }, null, 2));
} finally {
  await browser.close();
}
