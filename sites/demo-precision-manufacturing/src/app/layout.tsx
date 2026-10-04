import type { Metadata } from 'next';
import { Shell } from '@/components/shell';
import { asset } from '@/lib/site';
import './globals.css';
export const metadata: Metadata = {
  title: { default: '精工制造 · 小型制造商网站示例', template: '%s · 精工制造' },
  description: 'CNC 小批量制造商官网示例，展示工艺、样件与加工需求整理。由行人易安科技制作。',
  robots: { index: false, follow: false },
  icons: { icon: asset('images/logo.webp') },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
