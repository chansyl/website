import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deployment, normalizePrefix, validateSites } from '../tooling/config.mjs';
test('reject unsafe or colliding company directories', () => {
  for (const id of ['../outside', 'a/b', 'a.b', '_next', '404', 'A', 'a--b'])
    assert.throws(() => validateSites([{ id, enabled: true }]));
  assert.throws(() =>
    validateSites([
      { id: 'demo', enabled: true },
      { id: 'demo', enabled: true },
    ]),
  );
  assert.throws(() => validateSites([{ id: 'demo', enabled: false }]));
  assert.deepEqual(
    validateSites([
      { id: 'one', enabled: false },
      { id: 'two', enabled: true },
    ]),
    [{ id: 'two', enabled: true }],
  );
});
test('derive repository Pages and custom-domain prefixes without double slashes', () => {
  assert.deepEqual(deployment({ PAGES_URL: 'https://chansyl.github.io/website/' }), {
    origin: 'https://chansyl.github.io',
    prefix: '/website',
  });
  assert.deepEqual(deployment({ PAGES_URL: 'https://example.com/' }), {
    origin: 'https://example.com',
    prefix: '',
  });
  assert.equal(normalizePrefix('/website/'), '/website');
  for (const path of ['/../x', '//evil', 'x', '/x?q=1', '/x#id'])
    assert.throws(() => normalizePrefix(path));
  for (const url of ['file:///tmp', 'https://a.test/?secret=a', 'https://u:p@a.test'])
    assert.throws(() => deployment({ PAGES_URL: url }));
});
