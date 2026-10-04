import Link from 'next/link';
import { asset } from '@/lib/site';
export const metadata = { title: '加工能力' };
export default function Page() {
  return (
    <main id="main">
      <section className="container section">
        <p className="eyebrow">PROCESS & CAPABILITIES</p>
        <h1>
          把加工范围，
          <br />
          讲得具体一些。
        </h1>
        <p className="muted">以下内容展示制造商官网的信息组织方式，不代表实际加工承诺。</p>
        <div className="capability-grid">
          <img src={asset('images/hero.webp')} alt="加工场景示意" width="800" height="600" />
          <div>
            {[
              ['CNC 铣削', '平面、型腔、孔位与异形结构。沟通时明确基准、装配关系和表面处理。'],
              ['精密车削', '轴类、套类与回转结构。提前确认配合部位、材料与检验要求。'],
              ['样件试制', '用样件核对外观、装配与功能，再讨论后续小批量生产。'],
            ].map(([n, d]) => (
              <article className="capability" key={n}>
                <h2>{n}</h2>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="light-section">
        <div className="container section">
          <h2>材料、设备与质量信息</h2>
          <div className="quality-grid">
            {[
              ['材料沟通', '铝合金、钢材等材料应以实际图纸要求与供应情况确认。'],
              ['设备信息', '正式网站可展示真实设备型号、行程和加工范围；此示例不虚构设备清单。'],
              ['检验流程', '结合图纸讨论首件、关键尺寸和外观检查，并记录样件确认结果。'],
            ].map(([n, d]) => (
              <article key={n}>
                <h3>{n}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
          <a
            className="button outline"
            href={asset('downloads/manufacturing-checklist.pdf')}
            download
          >
            下载演示加工需求清单 PDF
          </a>
        </div>
      </section>
      <section className="container section">
        <h2>开始前，先准备清晰的需求。</h2>
        <Link className="button" href="/requirements/">
          整理加工需求
        </Link>
      </section>
    </main>
  );
}
