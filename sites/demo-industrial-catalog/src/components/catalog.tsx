'use client';
import { useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { MagnifyingGlass, SlidersHorizontal, X } from '@phosphor-icons/react';
import { categories, products } from '@/content/products';
import { ProductCard } from './product-card';
type Filters = { type: string; size: string; material: string };
const blank: Filters = { type: '', size: '', material: '' };
export function Catalog() {
  const params = useSearchParams();
  const initial = params.get('category') || '';
  const [category, setCategory] = useState(categories.some((c) => c.id === initial) ? initial : '');
  const [query, setQuery] = useState(params.get('q') || '');
  const [filters, setFilters] = useState<Filters>(blank);
  const [draft, setDraft] = useState<Filters>(blank);
  const dialog = useRef<HTMLDialogElement>(null);
  const base = products.filter(
    (p) =>
      (!category || p.category === category) &&
      `${p.name} ${p.id} ${p.spec} ${p.material}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const matching = (f: Filters) =>
    base.filter(
      (p) =>
        (!f.type || p.type === f.type) &&
        (!f.size || p.size === f.size) &&
        (!f.material || p.material === f.material),
    );
  const shown = matching(filters);
  const count = Object.values(filters).filter(Boolean).length;
  function fields(f: Filters, set: (f: Filters) => void) {
    return (
      <>
        {(['type', 'size', 'material'] as const).map((key) => (
          <fieldset key={key}>
            <legend>{{ type: '产品类型', size: '内径 / 规格', material: '材质' }[key]}</legend>
            <div className="chips">
              {[
                ...(key === 'material' ? [''] : []),
                ...new Set(
                  products.filter((p) => !category || p.category === category).map((p) => p[key]),
                ),
              ].map((v) => (
                <button
                  type="button"
                  key={v}
                  aria-pressed={f[key] === v}
                  onClick={() => set({ ...f, [key]: f[key] === v ? '' : v })}
                >
                  {v ? (key === 'size' && !v.startsWith('M') ? `${v} mm` : v) : '不限'}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </>
    );
  }
  return (
    <>
      <div className="catalog-top">
        <p className="eyebrow">PRODUCT CATALOG</p>
        <h1>{categories.find((c) => c.id === category)?.name || '全部产品'}目录</h1>
        <div className="search">
          <MagnifyingGlass size={22} />
          <input
            aria-label="搜索型号或规格"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索型号、产品或规格"
          />
        </div>
        <div className="chips category-tabs">
          {[{ id: '', name: '全部产品' }, ...categories].map((c) => (
            <button
              key={c.id}
              aria-pressed={category === c.id}
              onClick={() => {
                setCategory(c.id);
                setFilters(blank);
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div className="catalog-layout">
        <aside className="desktop-filters">
          <h2>筛选产品</h2>
          {fields(filters, setFilters)}
          <button className="text-button" onClick={() => setFilters(blank)}>
            清空条件
          </button>
        </aside>
        <div>
          <div className="result-toolbar">
            <p role="status">共 {shown.length} 款示例产品</p>
            <button
              className="button outline filter-toggle"
              onClick={() => {
                setDraft(filters);
                dialog.current?.showModal();
              }}
            >
              <SlidersHorizontal />
              筛选 · {count}
            </button>
          </div>
          <div className="product-grid">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {!shown.length && (
            <div className="empty">
              <h2>暂时没有匹配的示例产品</h2>
              <p>试试其他型号，或清空筛选条件。</p>
              <button
                className="button"
                onClick={() => {
                  setQuery('');
                  setFilters(blank);
                  setCategory('');
                }}
              >
                查看全部产品
              </button>
            </div>
          )}
        </div>
      </div>
      <dialog className="filter-sheet" ref={dialog} aria-label="筛选产品">
        <div className="sheet-title">
          <h2>筛选产品</h2>
          <button aria-label="关闭筛选" onClick={() => dialog.current?.close()}>
            <X size={26} />
          </button>
        </div>
        {fields(draft, setDraft)}
        <p className="muted">当前条件匹配 {matching(draft).length} 款示例产品</p>
        <div className="sheet-actions">
          <button className="button outline" onClick={() => setDraft(blank)}>
            重置
          </button>
          <button
            className="button"
            onClick={() => {
              setFilters(draft);
              dialog.current?.close();
            }}
          >
            查看 {matching(draft).length} 款产品
          </button>
        </div>
      </dialog>
    </>
  );
}
