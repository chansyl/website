import Link from 'next/link';
import { notFound } from 'next/navigation';
import { samples } from '@/content/samples';
import { asset } from '@/lib/site';
export function generateStaticParams() {
  return samples.map((s) => ({ id: s.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: samples.find((s) => s.id === id)?.name || '样件' };
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = samples.find((s) => s.id === id);
  if (!s) notFound();
  return (
    <main id="main" className="light-section">
      <div className="container section">
        <nav className="breadcrumbs">
          <Link href="/samples/">样件展示</Link> / {s.name}
        </nav>
        <div className="detail-grid">
          <img
            className="detail-image"
            src={asset(`images/${s.image}.webp`)}
            alt={`${s.name}概念样件`}
            width="800"
            height="600"
          />
          <div>
            <p className="eyebrow">CONCEPT SAMPLE</p>
            <h1>{s.name}</h1>
            <p>{s.description}</p>
            <dl>
              <div>
                <dt>工艺示例</dt>
                <dd>{s.process}</dd>
              </div>
              <div>
                <dt>材料示例</dt>
                <dd>{s.material}</dd>
              </div>
            </dl>
            <h2>沟通关注点</h2>
            <ul>
              {s.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="notice">图片为生成式概念图，不用于加工或尺寸测量。</p>
            <Link className="button" href={`/requirements/?sample=${s.id}`}>
              整理类似加工需求
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
