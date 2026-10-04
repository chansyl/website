import type { Metadata } from 'next';
import { SiteShell } from '@/components/site-shell';
import { asset } from '@/lib/site';
import './globals.css';
export const metadata: Metadata = {
  title: { default: '工业优选 · 工业品经销商网站示例', template: '%s · 工业优选' },
  description: '工业品经销商官网示例：产品选型、参数筛选与询价清单。由行人易安科技制作。',
  robots: { index: false, follow: false },
  icons: { icon: asset('images/logo.webp') },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
