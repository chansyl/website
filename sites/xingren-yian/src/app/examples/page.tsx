import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { asset, site, pageMetadata } from '@/lib/site';
import styles from './page.module.css';
export const metadata = pageMetadata(
  '行业网站示例',
  '为工业品经销商和小型制造商设计的电脑、手机独立体验。',
  'examples/',
);
const examples = [
  {
    id: 'demo-industrial-catalog',
    tag: '工业品经销商',
    name: '工业优选',
    description: '按型号找产品，按参数选配件。',
    features: '产品目录 · 参数筛选 · 询价清单',
    image: 'example-catalog',
    port: 3001,
    choice: 'industrial-catalog',
  },
  {
    id: 'demo-precision-manufacturing',
    tag: '小型制造商',
    name: '精工制造',
    description: '从一件样品，到稳定的小批量交付。',
    features: '工艺能力 · 样件展示 · 加工需求',
    image: 'example-manufacturing',
    port: 3002,
    choice: 'precision-manufacturing',
  },
];
export default function Examples() {
  const prefix = site.basePath.slice(0, site.basePath.lastIndexOf('/'));
  return (
    <main id="main" className={styles.page}>
      <div className={styles.intro}>
        <p className="eyebrow">BUILT FOR YOUR BUSINESS</p>
        <h1>
          你的生意，
          <br />
          值得一个更懂它的网站。
        </h1>
        <p>
          让客户找到产品、看懂实力，再带着明确需求联系你。
          <br />
          看看同类企业，可以如何展示自己。
        </p>
        <nav className={styles.categories} aria-label="按企业类型浏览">
          <a href="#demo-industrial-catalog">我是经销商</a>
          <a href="#demo-precision-manufacturing">我是制造商</a>
        </nav>
      </div>
      <div className={styles.grid}>
        {examples.map((e) => (
          <article id={e.id} key={e.id} className={styles.card}>
            <div className={styles.preview}>
              <img
                src={asset(`images/${e.image}.webp`)}
                alt={`${e.name}电脑页面预览`}
                width="900"
                height="700"
              />
              <img
                className={styles.phone}
                src={asset(`images/${e.image}-mobile.webp`)}
                alt={`${e.name}手机页面预览`}
                width="390"
                height="844"
              />
            </div>
            <div className={styles.copy}>
              <p className="eyebrow">{e.tag} / 虚构企业示例</p>
              <h2>{e.name}</h2>
              <p>{e.description}</p>
              <p className={styles.features}>{e.features}</p>
              <div className={styles.actions}>
                <a
                  className="button button-primary"
                  href={site.basePath ? `${prefix}/${e.id}/` : `http://127.0.0.1:${e.port}/`}
                >
                  查看完整示例 <ArrowUpRight />
                </a>
                <Link
                  className="button button-outline"
                  href={`/contact/?service=corporate-website&example=${e.choice}`}
                >
                  我也要类似网站
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <section className={styles.comparison}>
        <h2>选适合生意的表达方式。</h2>
        <div className={styles.compareGrid}>
          <div>
            <h3>客户知道型号，要找产品</h3>
            <p>从工业优选开始：把产品目录、规格和数量整理清楚，让一次询价更完整。</p>
          </div>
          <div>
            <h3>客户带着图纸，要找能力</h3>
            <p>从精工制造开始：讲清工艺、样件和交付流程，让客户判断是否值得进一步沟通。</p>
          </div>
        </div>
        <p>两套都为手机单独设计。布局、功能和内容可以按需组合，不限于固定模板。</p>
        <p className={styles.note}>
          这里展示的是设计示例，并非真实客户案例。演示站的产品、参数、样件和企业资料均为虚构；不会向供应商发送询盘。
        </p>
      </section>
    </main>
  );
}
