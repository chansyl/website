import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, CheckCircle } from '@phosphor-icons/react/dist/ssr';
import { services } from '@/content/services';
import { asset, pageMetadata } from '@/lib/site';
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  return service ? pageMetadata(service.name, service.description, `services/${slug}/`) : {};
}
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  if (!s) notFound();
  return (
    <main id="main" className="inner-main">
      <div className="container">
        <nav className="breadcrumb" aria-label="面包屑">
          <Link href="/">首页</Link>
          <span>/</span>
          <Link href="/#services">服务能力</Link>
          <span>/</span>
          <span>{s.name}</span>
        </nav>
        <section className="detail-hero">
          <img
            className="detail-planet"
            src={asset('images/planet.webp')}
            alt=""
            width="290"
            height="290"
          />
          <p className="eyebrow">{s.english}</p>
          <h1>{s.title}</h1>
          <p className="lead">{s.description}</p>
          <Link
            href={`/contact/?service=${s.slug}`}
            className="button button-primary"
            data-primary-cta
          >
            聊聊{s.name}需求 <ArrowUpRight size={19} />
          </Link>
          <div className="tags">
            {s.scenarios.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </section>
        <section className="section detail-grid">
          <div className="detail-intro">
            <p className="eyebrow">MADE FOR YOUR BUSINESS</p>
            <h2>
              把需求讲清楚，
              <br />
              <em>把体验做到位。</em>
            </h2>
            <p>{s.intro}</p>
          </div>
          <div className="feature-list">
            {s.features.map(([title, description]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section value-section">
          <p className="eyebrow">CLEAR DELIVERABLES</p>
          <h2>
            交付有内容，<em>合作有依据。</em>
          </h2>
          <p className="section-description">具体范围在项目开始前一起确认。</p>
          <div className="deliverables">
            {s.deliverables.map((d) => (
              <div key={d}>
                <CheckCircle size={25} weight="light" />
                <p>{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="section value-section">
          <p className="eyebrow">A FEW THINGS TO KNOW</p>
          <h2>你可能想了解</h2>
          <div className="faq-list">
            {s.faq.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <div className="related-services">
          <span>其他服务</span>
          {services
            .filter((item) => item.slug !== s.slug)
            .map((item) => (
              <Link key={item.slug} href={`/services/${item.slug}/`}>
                {item.name}
              </Link>
            ))}
        </div>
      </div>
      <section className="closing-section" data-contact-section>
        <div className="container">
          <p className="eyebrow">YOUR NEXT STEP STARTS HERE</p>
          <h2>
            从你的业务，
            <br />
            聊起下一步。
          </h2>
          <p>不必准备完整方案，一个具体的想法就可以开始。</p>
          <Link href={`/contact/?service=${s.slug}`} className="button button-primary">
            聊聊我的项目 <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>
    </main>
  );
}
