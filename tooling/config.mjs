export function validateSites(sites) {
  if (!Array.isArray(sites) || !sites.length)
    throw new Error('sites.manifest.json must be a non-empty array');
  const ids = new Set();
  for (const site of sites) {
    if (
      !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(site.id) ||
      ['assets', '_next', '404'].includes(site.id)
    )
      throw new Error(`Invalid site id: ${site.id}`);
    if (ids.has(site.id)) throw new Error(`Duplicate site id: ${site.id}`);
    if (typeof site.enabled !== 'boolean') throw new Error(`Missing enabled flag: ${site.id}`);
    ids.add(site.id);
  }
  const enabled = sites.filter((s) => s.enabled);
  if (!enabled.length) throw new Error('At least one site must be enabled');
  return enabled;
}
export function normalizePrefix(prefix = '') {
  if (prefix === '' || prefix === '/') return '';
  if (!/^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\/?$/.test(prefix))
    throw new Error(`Invalid Pages prefix: ${prefix}`);
  return prefix.replace(/\/$/, '');
}
export function deployment(env = process.env) {
  if (env.PAGES_URL) {
    const url = new URL(env.PAGES_URL);
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      throw new Error('PAGES_URL must be a public HTTP(S) base URL');
    return { origin: url.origin, prefix: normalizePrefix(url.pathname) };
  }
  return { origin: '', prefix: normalizePrefix(env.PAGES_BASE_PATH || '') };
}
