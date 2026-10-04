export function staticSiteConfig(basePath = '') {
  if (basePath && !/^\/[a-zA-Z0-9/_-]+$/.test(basePath)) throw new Error('Invalid site base path');
  return {
    output: 'export',
    trailingSlash: true,
    basePath: basePath.replace(/\/$/, ''),
    images: { unoptimized: true },
    poweredByHeader: false,
    devIndicators: false,
  };
}
