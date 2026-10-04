import type { Metadata } from 'next';

export const site = {
  name: '行人易安科技',
  email: 'chansyl8187@gmail.com',
  phone: '13067882884',
  // Put an approved QR code in public/images and set its path here.
  wechatQr: '' as string,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  url: process.env.NEXT_PUBLIC_SITE_URL || '',
  indexable: process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true',
};
export function asset(path: string) {
  return `${site.basePath}/${path.replace(/^\//, '')}`;
}
export function pageMetadata(title: string, description: string, path = ''): Metadata {
  const url = site.url ? `${site.url.replace(/\/$/, '')}/${path.replace(/^\//, '')}` : undefined;
  return {
    title: { absolute: `${title} · ${site.name}` },
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'zh_CN',
      siteName: site.name,
      ...(url
        ? {
            url,
            images: [
              {
                url: new URL('images/hero-desktop.webp', `${site.url.replace(/\/$/, '')}/`).href,
                width: 1600,
                height: 900,
                alt: site.name,
              },
            ],
          }
        : {}),
    },
  };
}
