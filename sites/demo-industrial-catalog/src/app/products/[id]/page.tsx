import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products, categories } from '@/content/products';
import { asset } from '@/lib/site';
import { AddButton } from '@/components/site-shell';
export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: products.find((p) => p.id === id)?.name || '产品' };
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = products.find((p) => p.id === id);
  if (!p) notFound();
  return (
    <main id="main" className="container section">
      <nav className="breadcrumbs">
        <Link href="/products/">产品目录</Link> /{' '}
        {categories.find((c) => c.id === p.category)?.name} / {p.id}
      </nav>
      <div className="detail-grid">
        <img
          className="detail-image"
          src={asset(`images/${p.image}.webp`)}
          alt={`${p.name}品类示意，不对应实际型号`}
          width="700"
          height="700"
        />
        <div>
          <span className="badge">示例产品 · 品类示意</span>
          <h1>{p.name}</h1>
          <p className="eyebrow">{p.id}</p>
          <p>{p.note}</p>
          <dl>
            <div>
              <dt>产品类型</dt>
              <dd>{p.type}</dd>
            </div>
            <div>
              <dt>材质</dt>
              <dd>{p.material}</dd>
            </div>
            <div>
              <dt>规格示意</dt>
              <dd>{p.spec}</dd>
            </div>
          </dl>
          <p className="notice">图片与参数仅用于展示网站功能，不作为实际采购或选型依据。</p>
          <AddButton id={p.id} />
          <Link className="text-link" href="/inquiry/">
            查看询价清单 →
          </Link>
        </div>
      </div>
      <section className="section">
        <h2>询价前，建议准备这些信息</h2>
        <p>型号与用途、配套尺寸、数量、使用环境和期望交期。适配性需由真实供应商确认。</p>
        <Link href="/support/" className="button outline">
          查看选型支持
        </Link>
      </section>
    </main>
  );
}
