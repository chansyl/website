import { readFile, mkdir, rm, cp, writeFile, rename } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateSites, deployment } from './config.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
const sites = validateSites(JSON.parse(await readFile('sites.manifest.json', 'utf8')));
const { origin, prefix } = deployment();
// Assemble into staging; a failed company build never produces a partial Pages upload.
await rm('.pages-staging', { recursive: true, force: true });
await mkdir('.pages-staging', { recursive: true });
for (const site of sites) {
  const basePath = `${prefix}/${site.id}`;
  const child = spawnSync('pnpm', ['--dir', `sites/${site.id}`, 'build'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
      NEXT_PUBLIC_BASE_PATH: basePath,
      NEXT_PUBLIC_SITE_URL: origin ? `${origin}${basePath}` : '',
      NEXT_PUBLIC_ALLOW_INDEXING: process.env.ALLOW_INDEXING === 'true' ? 'true' : 'false',
    },
  });
  if (child.error || child.status !== 0) throw child.error || new Error(`Build failed: ${site.id}`);
  await rm(`dist/${site.id}`, { recursive: true, force: true });
  await mkdir('dist', { recursive: true });
  await cp(`sites/${site.id}/out`, `dist/${site.id}`, { recursive: true });
  await cp(`dist/${site.id}`, `.pages-staging/${site.id}`, { recursive: true });
}
const destination = `${prefix}/${sites[0].id}/`;
await writeFile(
  '.pages-staging/index.html',
  `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${destination}"><title>访问官网</title><body><a href="${destination}">访问行人易安科技官网</a></body></html>`,
);
await writeFile(
  '.pages-staging/404.html',
  `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>页面不存在</title><body style="background:#05060c;color:#eee;font-family:system-ui;padding:12vw"><h1>这一页暂时不在航线上。</h1><a style="color:#d4b1fa" href="${destination}">回到官网首页</a></body></html>`,
);
await writeFile('.pages-staging/.nojekyll', '');
await writeFile(
  '.pages-staging/build-info.json',
  JSON.stringify(
    { prefix, sites: sites.map((s) => s.id), commit: process.env.GITHUB_SHA || 'local' },
    null,
    2,
  ),
);
await rm('.pages', { recursive: true, force: true });
await rename('.pages-staging', '.pages');
console.log(`Built ${sites.length} site(s) into dist/ and .pages/. Prefix: ${prefix || '/'}`);
