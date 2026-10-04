import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { reportUrl } from './omega-mock.mjs';
const base = process.env.TEST_URL || 'http://127.0.0.1:4173/website/xingren-yian/';
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome' });
try {
  for (const outcome of ['success', 'server-error', 'network-error']) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce',
      permissions: ['clipboard-read', 'clipboard-write'],
    });
    const errors = [];
    const requests = [];
    let release;
    const pending = new Promise((resolve) => {
      release = resolve;
    });
    await context.route(reportUrl, async (route) => {
      requests.push(route.request());
      // The summary must work while the server has not responded yet.
      await pending;
      if (outcome === 'network-error') await route.abort('failed');
      else
        await route.fulfill({
          status: outcome === 'success' ? 204 : 500,
          headers: { 'access-control-allow-origin': '*' },
        });
    });
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${base}contact/?service=app`, { waitUntil: 'networkidle' });
    assert.equal(requests.length, 0);
    await page.getByRole('button', { name: '整理我的需求', exact: true }).click();
    assert.equal(requests.length, 0);
    await page.locator('#needs').fill('   ');
    await page.getByRole('button', { name: '整理我的需求', exact: true }).click();
    assert.equal(requests.length, 0);
    await page.locator('#needs').fill('开发移动应用\n支持中文与符号 & < > "。');
    await page.locator('#contact').fill('example@test.invalid');
    const report = page.waitForRequest(reportUrl);
    await page.getByRole('button', { name: '整理我的需求', exact: true }).click();
    const request = await report;
    const summary = await page.getByRole('textbox', { name: '需求摘要，可编辑' }).inputValue();
    assert.equal(request.method(), 'POST');
    assert.match(request.headers()['content-type'], /application\/json/);
    assert.deepEqual(request.postDataJSON(), {
      name: 'xingrenyian_website_submit_ck',
      attr: { content: summary },
    });
    assert.match(summary, /APP 开发/);
    assert.match(summary, /example@test.invalid/);
    await page.getByRole('button', { name: '复制摘要' }).click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), summary);
    const settled =
      outcome === 'network-error'
        ? page.waitForEvent('requestfailed', (r) => r.url() === reportUrl)
        : page.waitForResponse(reportUrl);
    release();
    await settled;
    await page.locator('#needs').fill('第二次需求，必须使用新摘要。');
    const nextReport = page.waitForRequest(reportUrl);
    await page.getByRole('button', { name: '整理我的需求', exact: true }).click();
    const nextRequest = await nextReport;
    const updated = await page.getByRole('textbox', { name: '需求摘要，可编辑' }).inputValue();
    assert.match(updated, /第二次需求/);
    assert.equal(nextRequest.postDataJSON().attr.content, updated);
    await page.getByRole('button', { name: '复制摘要' }).click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), updated);
    assert.equal(requests.length, 2, 'One report per valid generation, none on copy');
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`Passed report case: ${outcome}`);
  }
} finally {
  await browser.close();
}
