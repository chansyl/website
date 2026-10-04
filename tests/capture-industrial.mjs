import { chromium } from 'playwright';
import sharp from 'sharp';
const root = process.env.PREVIEW_ROOT || 'http://127.0.0.1:4176/website/';
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome' });
const dir = 'artifacts/qa/industrial/';
async function compare(page, source, name, width = 390, height = 844) {
  const output = `${dir}${name}.png`;
  await page.screenshot({ path: output });
  const ref = await sharp(`docs/design/industrial-showcase/mockups/${source}.png`)
    .resize(width, height, { fit: 'fill' })
    .png()
    .toBuffer();
  await sharp({ create: { width: width * 2, height, channels: 3, background: '#bbb' } })
    .composite([
      { input: ref, left: 0, top: 0 },
      { input: output, left: width, top: 0 },
    ])
    .png()
    .toFile(output.replace('.png', '-comparison.png'));
}
for (const width of [390, 1440]) {
  const page = await browser.newPage({
    viewport: { width, height: width === 390 ? 844 : 1120 },
    deviceScaleFactor: 1,
  });
  for (const [name, slug, source] of [
    ['a', 'demo-industrial-catalog', width === 390 ? 'a-mobile-home-v1' : 'a-desktop-v1'],
    ['c', 'demo-precision-manufacturing', width === 390 ? 'c-mobile-home-v1' : 'c-desktop-v1'],
  ]) {
    await page.goto(`${root}${slug}/`, { waitUntil: 'networkidle' });
    await compare(page, source, `${name}-home-${width}`, width, width === 390 ? 844 : 1120);
  }
  if (width === 390) {
    await page.goto(`${root}demo-industrial-catalog/products/?category=bearings`, {
      waitUntil: 'networkidle',
    });
    await page.getByRole('button', { name: /筛选 ·/ }).click();
    await page.getByRole('dialog').getByRole('button', { name: '深沟球轴承', exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: '20 mm', exact: true }).click();
    await compare(page, 'a-mobile-filter-v1', 'a-filter');
    await page.goto(`${root}demo-precision-manufacturing/requirements/`, {
      waitUntil: 'networkidle',
    });
    await page
      .getByRole('textbox', { name: '补充说明' })
      .fill('铝合金支架，小批量试制。希望先沟通加工方案。');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await compare(page, 'c-mobile-requirements-v1', 'c-requirements');
  }
  await page.goto(`${root}xingren-yian/examples/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${dir}gallery-${width}.png`, fullPage: true });
  await page.close();
}
await browser.close();
