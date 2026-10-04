import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { asset } from '@/lib/site';
import type { Product } from '@/content/products';
export function ProductCard({ product: p }: { product: Product }) {
  return (
    <Link href={`/products/${p.id}/`} className="product-card">
      <img
        src={asset(`images/${p.image}.webp`)}
        alt={`${p.name}品类示意`}
        width="240"
        height="240"
        loading="lazy"
      />
      <div>
        <span className="badge">示例产品</span>
        <h3>{p.name}</h3>
        <p className="model">{p.id}</p>
        <p>{p.spec}</p>
        <small>{p.material} · 参数仅作演示</small>
      </div>
      <ArrowRight className="row-arrow" />
    </Link>
  );
}
