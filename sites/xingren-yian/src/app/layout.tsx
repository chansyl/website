import type { Metadata, Viewport } from 'next';
import { Header, MobileContactBar, MotionControl } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { site, asset } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  icons: { icon: asset('images/icon.png') },
  title: { default: '行人易安科技 · 企业官网与应用定制', template: '%s · 行人易安科技' },
  description:
    '行人易安科技，提供官网开发、定制网站开发、APP 开发与小程序开发。电脑上看得全面，手机上用得顺手。',
  robots: { index: site.indexable, follow: true },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#05050c',
  colorScheme: 'dark',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip-link" href="#main">
          跳到主要内容
        </a>
        <Header />
        {children}
        <Footer />
        <MobileContactBar />
        <MotionControl />
      </body>
    </html>
  );
}
