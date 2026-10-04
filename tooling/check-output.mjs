import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
const root = resolve('.pages');
const { prefix, sites } = JSON.parse(await readFile(resolve(root, 'build-info.json'), 'utf8'));
async function walk(dir) {
  const result = [];
  for (const f of await readdir(dir, { withFileTypes: true })) {
    const p = resolve(dir, f.name);
    if (f.isDirectory()) result.push(...(await walk(p)));
    else result.push(p);
  }
  return result;
}
let count = 0;
const failures = [];
for (const id of sites) {
  const files = await walk(resolve(root, id));
  if (!files.some((f) => f.endsWith('/index.html'))) failures.push(`${id}: no index.html`);
  for (const f of files.filter((f) => f.endsWith('.html'))) {
    const html = await readFile(f, 'utf8');
    count++;
    if (!/<h1[\s>]/.test(html)) failures.push(`${f}: no h1`);
    for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      const url = match[1].split(/[?#]/)[0];
      if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
      let target;
      if (url.startsWith('/')) {
        if (!url.startsWith(`${prefix}/${id}/`) && url !== `${prefix}/${id}`) {
          failures.push(`${f}: wrong prefix ${url}`);
          continue;
        }
        target = resolve(root, `.${url.slice(prefix.length)}`);
      } else target = resolve(dirname(f), url);
      try {
        if ((await stat(target)).isDirectory()) await stat(resolve(target, 'index.html'));
      } catch {
        failures.push(`${f}: missing ${url}`);
      }
    }
  }
}
if (failures.length) throw new Error(failures.join('\n'));
console.log(
  `Verified ${count} HTML pages: headings, local links, images, scripts, styles and deployment prefixes.`,
);
