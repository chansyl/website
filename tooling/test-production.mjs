import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';
const { prefix } = JSON.parse(await readFile('.pages/build-info.json', 'utf8'));
const port = process.env.PORT || '4174';
const base = `http://127.0.0.1:${port}${prefix}/xingren-yian/`;
const server = spawn(process.execPath, ['tooling/preview.mjs'], {
  env: { ...process.env, PORT: port },
  stdio: 'inherit',
});
let serverFailed = false;
server.on('exit', () => {
  serverFailed = true;
});
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    if (serverFailed) throw new Error('Preview server exited before browser tests');
    try {
      const response = await fetch(base);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {}
    await setTimeout(250);
  }
  if (!ready) throw new Error('Preview server did not become ready');
  for (const file of ['tests/browser.mjs', 'tests/mobile-and-motion.mjs']) {
    const code = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [file], {
        env: { ...process.env, TEST_URL: base },
        stdio: 'inherit',
      });
      child.on('error', reject);
      child.on('exit', resolve);
    });
    if (code !== 0) throw new Error(`Browser tests failed: ${file}`);
  }
} finally {
  server.kill('SIGTERM');
}
