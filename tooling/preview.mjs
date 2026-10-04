import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('.pages');
const { prefix } = JSON.parse(await readFile(resolve(root, 'build-info.json'), 'utf8'));
const port = Number(process.env.PORT || 4173);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (prefix && path === prefix) {
      res.writeHead(308, { Location: `${prefix}/` });
      res.end();
      return;
    }
    if (prefix && !path.startsWith(`${prefix}/`)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    let file = resolve(root, `.${path.slice(prefix.length)}`);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if ((await stat(file)).isDirectory()) {
      if (!path.endsWith('/')) {
        res.writeHead(308, { Location: `${path}/` });
        res.end();
        return;
      }
      file = resolve(file, 'index.html');
    }
    const data = await readFile(file);
    res.writeHead(200, {
      'Content-Type': mime[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(await readFile(resolve(root, '404.html')));
  }
}).listen(port, '127.0.0.1', () =>
  console.log(`Preview: http://127.0.0.1:${port}${prefix}/xingren-yian/`),
);
