import { samples } from '@/content/samples';
import { SampleCard } from '@/components/sample-card';
export const metadata = { title: '样件展示' };
export default function Page() {
  return (
    <main id="main" className="light-section">
      <div className="container section">
        <p className="eyebrow">SAMPLE GALLERY</p>
        <h1>
          从样件出发，
          <br />
          看懂工艺与需求。
        </h1>
        <p className="muted">概念样件仅作网站演示，不代表已交付客户项目。</p>
        <div className="samples-grid all-samples">
          {samples.map((s) => (
            <SampleCard key={s.id} sample={s} />
          ))}
        </div>
      </div>
    </main>
  );
}
