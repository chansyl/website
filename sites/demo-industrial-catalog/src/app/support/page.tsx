import Link from 'next/link';
import { agency, asset } from '@/lib/site';
export const metadata = { title: '选型与采购支持' };
export default function Page() {
  return (
    <main id="main" className="container section narrow">
      <p className="eyebrow">PROCUREMENT SUPPORT</p>
      <h1>
        让每一次沟通，
        <br />
        都有清晰的起点。
      </h1>
      <p>先确认型号、参数和用途，再与供应商讨论选型及交期。</p>
      <section className="section">
        <h2>采购前的三步准备</h2>
        {[
          ['01', '确定产品', '记录型号、名称或旧件标识。不确定时，准备清晰的产品照片。'],
          ['02', '核对参数', '确认安装尺寸、材质、工作环境与配套条件。'],
          ['03', '整理清单', '把需要的数量与交期放在一起，减少反复沟通。'],
        ].map(([n, t, d]) => (
          <article className="support-step" key={n}>
            <span>{n}</span>
            <div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          </article>
        ))}
        <a className="button outline" href={asset('downloads/inquiry-checklist.pdf')} download>
          下载演示采购清单 PDF
        </a>
      </section>
      <section id="about">
        <h2>关于这个示例</h2>
        <p>
          工业优选是一家虚构的工业品经销商，用于展示企业官网如何组织产品、支持筛选和整理询价。页面中的图片、型号与参数不代表实际供货。
        </p>
        <p>真实企业可替换自己的产品、品牌和授权素材，并按需接入正式询盘服务。</p>
        <a
          className="button"
          href={agency('contact/?service=corporate-website&example=industrial-catalog')}
        >
          向行人易安咨询类似网站
        </a>
      </section>
      <section className="section">
        <h2>常见问题</h2>
        <details>
          <summary>这里可以下单购买吗？</summary>
          <p>这里是网站功能演示。没有支付、库存或真实订单功能。</p>
        </details>
        <details>
          <summary>产品参数可以用来选型吗？</summary>
          <p>不能。所有记录均为示例，真实采购应依据供应商资料与技术确认。</p>
        </details>
        <Link className="text-link" href="/products/">
          返回产品目录 →
        </Link>
      </section>
    </main>
  );
}
