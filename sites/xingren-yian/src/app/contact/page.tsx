import { Suspense } from 'react';
import Link from 'next/link';
import { EnvelopeSimple, Phone, WechatLogo } from '@phosphor-icons/react/dist/ssr';
import { ContactForm } from '@/components/contact-form';
import { site, asset, pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  '聊聊你的项目',
  '联系行人易安科技，交流官网、定制网站、APP 或小程序开发需求。',
  'contact/',
);
export default function ContactPage() {
  return (
    <main id="main" className="inner-main container">
      <nav className="breadcrumb" aria-label="面包屑">
        <Link href="/">首页</Link>
        <span>/</span>
        <span>开启对话</span>
      </nav>
      <div className="contact-heading">
        <p className="eyebrow">LET&apos;S MAKE IT HAPPEN</p>
        <h1>
          你的下一步，
          <br />
          <em>我们一起实现。</em>
        </h1>
        <p>
          一个新官网，一次体验升级，或一个等待实现的产品想法。
          <br />
          先说说你的业务，我们从这里开始。
        </p>
      </div>
      <div className="contact-layout">
        <Suspense fallback={<p>正在准备需求整理工具…</p>}>
          <ContactForm />
        </Suspense>
        <aside className="contact-channels">
          <h2>也可以直接聊聊</h2>
          <p>用你习惯的方式，联系行人易安科技。</p>
          <a className="channel" href={`mailto:${site.email}`}>
            <EnvelopeSimple size={25} />
            <span>
              <small>邮件沟通</small>
              <strong>{site.email}</strong>
            </span>
          </a>
          <a className="channel" href={`tel:${site.phone}`}>
            <Phone size={25} />
            <span>
              <small>电话联系</small>
              <strong>{site.phone}</strong>
            </span>
          </a>
          <div className="wechat-area">
            {site.wechatQr ? (
              <a
                href={asset(site.wechatQr)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="查看微信二维码原图（新窗口）"
              >
                <img
                  src={asset(site.wechatQr)}
                  alt="行人易安科技微信联系二维码"
                  width="108"
                  height="108"
                />
              </a>
            ) : (
              <div className="qr-placeholder">
                <WechatLogo size={32} weight="light" />
                <span>二维码待更新</span>
              </div>
            )}
            <div>
              <h3>微信沟通</h3>
              <p>
                {site.wechatQr
                  ? '扫码添加，或点开二维码查看原图。'
                  : '微信二维码即将补充，\n欢迎先通过邮件或电话联系。'}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
