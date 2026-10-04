import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  GlobeHemisphereWest,
  SquaresFour,
  LinkSimple,
  Stack,
  Plus,
} from '@phosphor-icons/react/dist/ssr';
import { services, processSteps } from '@/content/services';
import { Experience } from '@/components/experience';
import { asset, pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  '让企业拥有自己的线上主场',
  '企业官网、定制网站、APP 与小程序开发。独立设计电脑与手机体验，围绕真实业务按需交付。',
);
const values = [
  {
    icon: GlobeHemisphereWest,
    title: '一个正式的品牌入口',
    text: '用统一的品牌形象与真实信息，让初次接触你的客户，有一个认真了解你的地方。',
  },
  {
    icon: SquaresFour,
    title: '一次完整的业务介绍',
    text: '有条理地呈现产品、服务与合作方式，让客户按自己的节奏阅读，带着更明确的问题联系你。',
  },
  {
    icon: LinkSimple,
    title: '每一次分享，都有去处',
    text: '从名片、邮件到社交主页，一个官网链接，把不同渠道的关注连接到完整的企业信息。',
  },
  {
    icon: Stack,
    title: '持续积累企业的内容',
    text: '逐步补充产品资料、服务说明与真实案例，让官网记录企业的能力与变化。',
  },
];
export default function Home() {
  return (
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <picture className="hero-scene">
          <source media="(max-width: 767px)" srcSet={asset('images/hero-mobile.webp')} />
          <img
            src={asset('images/hero-desktop.webp')}
            alt=""
            width="1672"
            height="941"
            fetchPriority="high"
          />
        </picture>
        <div className="hero-content container">
          <p className="hero-kicker">
            企业官网 <span /> 网站与应用定制
          </p>
          <h1 id="hero-title">
            <span>让你的企业，</span>
            <span>
              拥有自己的<em>线上主场。</em>
            </span>
          </h1>
          <p className="hero-description desktop-only">
            当客户想进一步了解你，让一个专业的官网，完整呈现企业、产品与服务。
            <br />
            从电脑上的深入了解，到手机上的随时访问，都顺畅自然。
          </p>
          <p className="hero-description mobile-only">
            一个官网，完整呈现你的企业。
            <br />
            电脑上看得全面，手机上用得顺手。
          </p>
          <div className="hero-actions">
            <Link
              href="/contact/?service=corporate-website"
              data-primary-cta
              className="button button-primary"
            >
              聊聊建站需求 <ArrowUpRight size={20} />
            </Link>
            <a href="#experience" className="text-link">
              看看双端体验 <ArrowDown size={17} />
            </a>
          </div>
        </div>
        <div className="hero-side-note" aria-hidden="true">
          IDEAS
          <br />
          INTO
          <br />
          REAL
          <br />
          POSSIBILITIES
        </div>
        <div className="hero-scroll" aria-hidden="true">
          <span>向下探索</span>
          <ArrowDown size={14} />
        </div>
      </section>
      <section
        id="services"
        className="services-section container"
        aria-labelledby="services-title"
      >
        <div className="mobile-only service-intro">
          <p className="eyebrow">OUR EXPERTISE</p>
          <h2 id="services-title">你想打造什么？</h2>
          <p>按需选择，深入了解。</p>
        </div>
        <div className="service-grid">
          {services.map((s, i) => (
            <Link
              className={`service-entry service-${i}`}
              key={s.slug}
              href={`/services/${s.slug}/`}
            >
              <img
                src={asset('images/planet.webp')}
                alt=""
                width="130"
                height="130"
                loading="lazy"
              />
              <span className="service-number">0{i + 1}</span>
              <h3>{s.name}</h3>
              <p>{s.short}</p>
              <ArrowUpRight className="service-arrow" size={22} weight="light" />
              <span className="service-english">{s.english}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section container value-section" aria-labelledby="value-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR OWN DIGITAL HOME</p>
            <h2 id="value-title">
              当客户想了解你，
              <br />
              <em>让官网把答案讲完整。</em>
            </h2>
          </div>
          <p className="section-description">
            一次搜索、一张名片、朋友的一次推荐。
            <br />
            让每一次关注，有一个清晰的落点。
            <br />
            你是谁，能提供什么，为什么值得进一步沟通。
          </p>
        </div>
        <div className="value-grid">
          {values.map((v, i) => (
            <article key={v.title}>
              <div className="value-top">
                <v.icon size={25} weight="light" />
                <span>0{i + 1}</span>
              </div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="experience" className="section experience-section">
        <div className="container">
          <Experience />
        </div>
      </section>
      <section
        id="process"
        className="section container process-section"
        aria-labelledby="process-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">FROM IDEA TO REALITY</p>
            <h2 id="process-title">
              每一步，
              <br />
              <em>都围绕你的业务。</em>
            </h2>
          </div>
          <p className="section-description">
            先了解目标，再明确范围。
            <br />
            把需要解决的问题，落实到具体方案与验收内容中。
          </p>
        </div>
        <div className="process-grid">
          {processSteps.map((p, i) => (
            <details key={p.title} className="process-step">
              <summary>
                <span className="step-number">0{i + 1}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.short}</p>
                </div>
                <span className="step-toggle" aria-hidden="true">
                  <Plus size={16} />
                </span>
              </summary>
              <div className="step-detail">
                <p>{p.detail}</p>
                <span>{p.output}</span>
              </div>
            </details>
          ))}
        </div>
        <p className="process-note">
          展示哪些内容、开发哪些功能、交付哪些资料，在开始前一起讲清楚。
        </p>
      </section>
      <section id="about" className="section about-section container">
        <div>
          <p className="eyebrow">BUILT WITH PURPOSE</p>
          <h2>
            以技术实现想法，
            <br />
            <em>以设计连接你与用户。</em>
          </h2>
        </div>
        <div className="about-copy">
          <h3>我们是行人易安科技。</h3>
          <p>
            提供官网开发、定制网站开发、APP
            开发与小程序开发。我们关注企业想表达什么，也关注用户如何阅读与使用。
          </p>
          <p>
            把业务需求落到清晰的页面、顺手的交互和约定的交付中，让你的下一步，有具体的实现方式。
          </p>
          <Link href="/contact/" className="text-link">
            从你的想法开始 <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="closing-section" data-contact-section>
        <img
          className="closing-planet"
          src={asset('images/planet.webp')}
          alt=""
          width="300"
          height="300"
          loading="lazy"
        />
        <div className="container">
          <p className="eyebrow">LET&apos;S BUILD WHAT&apos;S NEXT</p>
          <h2>
            让客户更好地了解你，
            <br />
            从一个好官网开始。
          </h2>
          <p>告诉我们你的业务、希望展示的内容，以及对网站的期待。</p>
          <Link href="/contact/?service=corporate-website" className="button button-primary">
            聊聊我的建站计划 <ArrowRight size={19} />
          </Link>
          <Link href="/contact/?service=app" className="closing-other">
            我需要 APP 或小程序开发 <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
