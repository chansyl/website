import type { MetadataRoute } from 'next';
import { services } from '@/content/services';
import { site } from '@/lib/site';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];
  return ['', 'contact/', 'examples/', ...services.map((s) => `services/${s.slug}/`)].map(
    (path) => ({
      url: `${site.url.replace(/\/$/, '')}/${path}`,
    }),
  );
}
