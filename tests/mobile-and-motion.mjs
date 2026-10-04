import { chromium } from 'playwright';
import { mockOmegaReports } from './omega-mock.mjs';
import assert from 'node:assert/strict';
const base = process.env.TEST_URL || 'http://127.0.0.1:4173/website/xingren-yian/';
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome' });
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  await mockOmegaReports(context);
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(await page.evaluate(() => innerWidth), 390);
  assert.match(
    await page.locator('.hero-scene img').evaluate((e) => e.currentSrc),
    /hero-mobile.webp/,
  );
  await page.getByRole('button', { name: '暂停装饰动画' }).tap();
  assert.equal(
    await page
      .locator('.service-entry img')
      .first()
      .evaluate((e) => getComputedStyle(e).animationPlayState),
    'paused',
  );
  await page.getByRole('button', { name: '打开导航菜单' }).tap();
  await page.getByRole('dialog').waitFor({ state: 'visible' });
  await page
    .getByRole('navigation', { name: '手机导航' })
    .getByRole('link', { name: /服务能力/ })
    .tap();
  assert.equal(await page.getByRole('dialog').isVisible(), false);
  await page.locator('.service-entry').first().tap();
  await page.waitForURL('**/services/corporate-website/');
  await page.locator('[data-primary-cta]').tap();
  await page.getByLabel('说说你的想法').fill('移动端触控测试');
  await page.getByRole('button', { name: '整理我的需求', exact: true }).tap();
  await page.getByRole('textbox', { name: '需求摘要，可编辑' }).waitFor();
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('permission denied')) },
      configurable: true,
    }),
  );
  await page.getByRole('button', { name: '复制摘要' }).tap();
  assert.match(await page.getByRole('status').innerText(), /手动复制/);
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'artifacts/qa/mobile-touch-390@3x.png' });
  await context.close();
  const keyboard = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  await keyboard.goto(base);
  await keyboard.keyboard.press('Tab');
  assert.equal(await keyboard.evaluate(() => document.activeElement.textContent), '跳到主要内容');
  await keyboard.keyboard.press('Enter');
  assert.match(keyboard.url(), /#main$/);
  console.log(
    'Passed: 390×844 touch at DPR 3, mobile asset selection, animation pause, touch navigation, clipboard-denied fallback, keyboard skip link.',
  );
} finally {
  await browser.close();
}
