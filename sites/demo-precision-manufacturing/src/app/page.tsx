import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { asset } from '@/lib/site';
import { samples, steps } from '@/content/samples';
import { SampleCard } from '@/components/sample-card';
export default function Home() {
  return (
    <main id="main">
      <section className="hero">
        <div className="container hero-content">
          <p className="eyebrow">CNC · 小批量定制加工</p>
          <h1>
            从一件样品，
            <br />到<span>稳定交付。</span>
          </h1>
          <p className="hero-sub">让工艺、材料与交付要求，在开始前就清晰。</p>
          <div className="hero-actions">
            <Link className="button primary" href="/requirements/">
              整理加工需求 <ArrowRight />
            </Link>
            <Link className="button outline" href="/capabilities/">
              查看加工能力 <ArrowUpRight />
            </Link>
          </div>
          <p className="hero-tags">CNC 铣削 / 精密车削 / 样件试制</p>
        </div>
        <img
          className="hero-photo"
          src={asset('images/hero.webp')}
          alt="CNC 刀具与铝合金工件的工艺概念图"
          width="1600"
          height="900"
          fetchPriority="high"
        />
        <span className="image-caption">工艺场景示意</span>
      </section>
      <section className="light-section">
        <div className="container section">
          <div className="section-title">
            <h2>
              <span className="desktop-title">用样件，看懂加工能力</span>
              <span className="mobile-title">用样件，看懂能力</span>
            </h2>
            <span />
            <Link href="/samples/">
              <span>查看全部样件</span> <ArrowRight />
            </Link>
          </div>
          <div className="samples-grid">
            {samples.slice(0, 3).map((s) => (
              <SampleCard key={s.id} sample={s} />
            ))}
          </div>
        </div>
      </section>
      <section id="process" className="container section process">
        <div className="section-title">
          <h2>从需求到交付，每一步有据可循</h2>
          <span />
        </div>
        <ol>
          {steps.map(([n, d], i) => (
            <li key={n}>
              <span>0{i + 1}</span>
              <div>
                <h3>{n}</h3>
                <p>{d}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="muted process-note">
          以上为交付流程示例，真实项目以双方确认的工艺与交付要求为准。
        </p>
      </section>
    </main>
  );
}
