import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { asset } from '@/lib/site';
import { samples } from '@/content/samples';
export function SampleCard({ sample: s }: { sample: (typeof samples)[number] }) {
  return (
    <Link href={`/samples/${s.id}/`} className="sample-card">
      <img
        src={asset(`images/${s.image}.webp`)}
        alt={`${s.name}概念样件`}
        width="800"
        height="600"
        loading="lazy"
      />
      <div>
        <small>示例样件</small>
        <h3>
          {s.name}
          <span> / {s.process}</span>
        </h3>
        <p className="mobile-process">{s.process}</p>
        <ArrowRight />
      </div>
    </Link>
  );
}
