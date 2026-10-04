import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const agency = process.env.TEST_URL || 'http://127.0.0.1:4173/website/xingren-yian/';
const a = new URL('../demo-industrial-catalog/', agency).href,
  c = new URL('../demo-precision-manufacturing/', agency).href;
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || 'chrome',
  headless: true,
});
const dir = 'artifacts/qa/industrial';
await mkdir(dir, { recursive: true });
const errors = [],
  checks = [];
try {
  for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: width <= 430 ? 844 : 1120 },
      reducedMotion: 'reduce',
      permissions: ['clipboard-read', 'clipboard-write'],
    });
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(`${m.text()} ${m.location().url}`);
    });
    let posts = 0;
    page.on('request', (r) => {
      if (r.method() === 'POST') posts++;
    });
    const overflow = async () =>
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `overflow ${width} ${page.url()}`,
      );
    for (const [url, name] of [
      [a, 'a'],
      [c, 'c'],
    ]) {
      await page.goto(url, { waitUntil: 'networkidle' });
      await overflow();
      assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /noindex/);
      // Visit lazy-loaded images before checking their decoded dimensions.
      for (const img of await page.locator('img:visible').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate((el) => el.decode());
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      assert.equal(
        await page
          .locator('img:visible')
          .evaluateAll((imgs) => imgs.every((i) => i.complete && i.naturalWidth > 0)),
        true,
      );
      if ([390, 1440].includes(width))
        await page.screenshot({ path: `${dir}/${name}-home-${width}.png` });
      if (width <= 430) {
        await page.getByRole('button', { name: '打开导航菜单' }).click();
        assert.ok(await page.getByRole('dialog').isVisible());
        await page.keyboard.press('Escape');
        assert.equal(await page.getByRole('dialog').isVisible(), false);
      }
    }
    await page.goto(a + 'products/?category=bearings', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.product-card').count(), 4);
    if (width <= 430) {
      await page.getByRole('button', { name: /筛选 ·/ }).click();
      const dlg = page.getByRole('dialog');
      await dlg.getByRole('button', { name: '深沟球轴承', exact: true }).click();
      await dlg.getByRole('button', { name: '20 mm', exact: true }).click();
      if (width === 390) await page.screenshot({ path: `${dir}/a-filter-390.png` });
      await dlg.getByRole('button', { name: '查看 2 款产品' }).click();
    } else {
      await page
        .locator('.desktop-filters')
        .getByRole('button', { name: '深沟球轴承', exact: true })
        .click();
      await page
        .locator('.desktop-filters')
        .getByRole('button', { name: '20 mm', exact: true })
        .click();
    }
    assert.equal(await page.locator('.product-card').count(), 2);
    await overflow();
    await page.getByRole('textbox', { name: '搜索型号或规格' }).fill('no-such-product');
    assert.ok(await page.getByRole('heading', { name: '暂时没有匹配的示例产品' }).isVisible());
    await page.getByRole('button', { name: '查看全部产品', exact: true }).click();
    assert.equal(await page.locator('.product-card').count(), 12);
    await page.goto(a + 'products/DEMO-B01/', { waitUntil: 'networkidle' });
    await overflow();
    await page.getByRole('button', { name: '加入询价清单' }).click();
    await page.getByRole('button', { name: '加入询价清单' }).click();
    await page.getByRole('link', { name: /查看询价清单/ }).click();
    await page.getByRole('spinbutton', { name: 'DEMO-B01数量' }).waitFor();
    assert.equal(await page.getByRole('spinbutton', { name: 'DEMO-B01数量' }).inputValue(), '2');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.getByRole('spinbutton', { name: 'DEMO-B01数量' }).inputValue(), '2');
    await page.getByRole('button', { name: '生成询价摘要' }).click();
    assert.match(
      await page.getByRole('textbox', { name: '询价摘要', exact: true }).inputValue(),
      /2 件/,
    );
    await page.getByRole('button', { name: '复制摘要' }).click();
    assert.equal(
      await page.evaluate(() => navigator.clipboard.readText()),
      await page.getByRole('textbox', { name: '询价摘要', exact: true }).inputValue(),
    );
    await page.getByRole('textbox', { name: '补充说明' }).fill('需要核对配套尺寸');
    assert.equal(await page.getByRole('textbox', { name: '询价摘要', exact: true }).count(), 0);
    await overflow();
    await page.getByRole('button', { name: '移除DEMO-B01' }).click();
    assert.ok(await page.getByRole('heading', { name: '清单还是空的' }).isVisible());
    await page.goto(c + 'requirements/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: '生成需求摘要' }).click();
    assert.equal(await page.getByRole('textbox', { name: '加工需求摘要' }).count(), 0);
    await page
      .getByRole('textbox', { name: '补充说明' })
      .fill('铝合金支架，小批量试制。希望先沟通加工方案。');
    await overflow();
    if (width === 390) await page.screenshot({ path: `${dir}/c-requirements-390.png` });
    await page.getByRole('button', { name: '生成需求摘要' }).click();
    assert.match(await page.getByRole('textbox', { name: '加工需求摘要' }).inputValue(), /50 件/);
    await page.getByRole('button', { name: '复制摘要' }).click();
    assert.equal(
      await page.evaluate(() => navigator.clipboard.readText()),
      await page.getByRole('textbox', { name: '加工需求摘要' }).inputValue(),
    );
    await page.getByRole('spinbutton', { name: '数量（件）' }).fill('75');
    assert.equal(await page.getByRole('textbox', { name: '加工需求摘要' }).count(), 0);
    await page.getByRole('button', { name: '生成需求摘要' }).click();
    assert.match(await page.getByRole('textbox', { name: '加工需求摘要' }).inputValue(), /75 件/);
    assert.equal(posts, 0, 'Demos must never submit data');
    for (const url of [
      c + 'samples/',
      c + 'samples/turned-shaft/',
      c + 'capabilities/',
      a + 'support/',
      agency + 'examples/',
    ]) {
      await page.goto(url, { waitUntil: 'networkidle' });
      await overflow();
    }
    await page.goto(c + 'samples/turned-shaft/');
    await page.getByRole('link', { name: '整理类似加工需求' }).click();
    assert.equal(
      await page
        .getByRole('button', { name: '精密车削', exact: true })
        .getAttribute('aria-pressed'),
      'true',
    );
    await page.goto(agency + 'examples/');
    const links = await page
      .getByRole('link', { name: '查看完整示例' })
      .evaluateAll((els) => els.map((e) => e.href));
    assert.deepEqual(links, [a, c]);
    await page.getByRole('link', { name: '我也要类似网站', exact: true }).first().click();
    await page.getByText(/你正在咨询类似「工业优选/).waitFor({ state: 'visible' });
    checks.push({ width, status: 'passed' });
    await context.close();
  }
  assert.deepEqual(errors, []);
  await writeFile(
    `${dir}/results.json`,
    JSON.stringify({ checks, consoleErrors: errors }, null, 2),
  );
  console.log(
    'Industrial showcase: seven widths, noindex, images, navigation, filters, search, empty state, inquiry persistence/summary/copy, manufacturing validation/summary, zero POSTs, cross-site links passed.',
  );
} finally {
  await browser.close();
}
