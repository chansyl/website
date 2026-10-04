import Link from 'next/link';
import { ArrowUpRight, ArrowUp, EnvelopeSimple, Phone } from '@phosphor-icons/react/dist/ssr';
import { services } from '@/content/services';
import { site } from '@/lib/site';
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="wordmark">
            行人易安科技
          </Link>
          <p>
            以技术实现想法，
            <br />
            以设计连接你与用户。
          </p>
        </div>
        <div>
          <p className="footer-label">服务能力</p>
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}/`}>
              {s.name}
            </Link>
          ))}
        </div>
        <div>
          <p className="footer-label">开启对话</p>
          <a href={`mailto:${site.email}`}>
            <EnvelopeSimple size={17} />
            {site.email}
          </a>
          <a href={`tel:${site.phone}`}>
            <Phone size={17} />
            {site.phone}
          </a>
          <Link href="/contact/">
            整理我的需求 <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} 行人易安科技</span>
        <span>为每一块屏幕，用心设计。</span>
        <Link href="/#main">
          回到起点 <ArrowUp size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
        </Link>
      </div>
    </footer>
  );
}
