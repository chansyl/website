'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Trash, Copy } from '@phosphor-icons/react';
import { useCart } from './site-shell';
import { products } from '@/content/products';
import { asset } from '@/lib/site';
export function Inquiry() {
  const { items, setQuantity } = useCart();
  const selected = products.filter((p) => items[p.id]);
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState('');
  const result = useRef<HTMLTextAreaElement>(null);
  function invalidate() {
    setSummary('');
    setStatus('清单已更新，请重新生成摘要。');
  }
  return (
    <>
      <h1>你的询价清单</h1>
      <p className="muted">先选好产品，再把型号和数量一起整理。</p>
      {selected.length ? (
        <>
          <div className="inquiry-list">
            {selected.map((p) => (
              <article className="inquiry-row" key={p.id}>
                <img src={asset(`images/${p.image}.webp`)} alt="品类示意" width="90" height="90" />
                <div>
                  <Link href={`/products/${p.id}/`}>
                    <strong>{p.name}</strong>
                  </Link>
                  <p>{p.id}</p>
                </div>
                <label>
                  数量
                  <input
                    aria-label={`${p.id}数量`}
                    type="number"
                    min="1"
                    max="9999"
                    value={items[p.id]}
                    onChange={(e) => {
                      setQuantity(p.id, Math.max(1, Number(e.target.value)));
                      invalidate();
                    }}
                  />
                </label>
                <button
                  aria-label={`移除${p.id}`}
                  onClick={() => {
                    setQuantity(p.id, 0);
                    invalidate();
                  }}
                >
                  <Trash size={23} />
                </button>
              </article>
            ))}
          </div>
          <form
            onChange={invalidate}
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              setSummary(
                '工业优选 · 演示询价清单（未发送）\n\n' +
                  selected
                    .map((p) => `${p.id} | ${p.name} | ${p.spec} | ${items[p.id]} 件`)
                    .join('\n') +
                  '\n\n补充说明：' +
                  (String(f.get('note')).trim() || '待沟通') +
                  '\n期望交期：' +
                  String(f.get('timeline')) +
                  '\n\n以上为虚构产品与示例参数，不用于采购。',
              );
              setStatus('摘要已生成，仅在本机整理，未发送。');
              requestAnimationFrame(() => result.current?.focus());
            }}
          >
            <label className="field">
              期望交期
              <select name="timeline">
                <option>可协商</option>
                <option>两周内</option>
                <option>一个月内</option>
              </select>
            </label>
            <label className="field">
              补充说明
              <textarea name="note" maxLength={1000} placeholder="例如：用途、配套尺寸和使用环境" />
            </label>
            <p className="notice">演示清单仅在当前浏览器会话保存产品和数量，不发送询盘。</p>
            <button className="button" type="submit">
              生成询价摘要
            </button>
          </form>
        </>
      ) : (
        <div className="empty">
          <h2>清单还是空的</h2>
          <p>从产品详情页加入关注的配件。</p>
          <Link className="button" href="/products/">
            浏览产品目录
          </Link>
        </div>
      )}
      {summary && (
        <section className="summary">
          <h2>询价摘要</h2>
          <textarea ref={result} aria-label="询价摘要" value={summary} readOnly />
          <button
            className="button outline"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(summary);
                setStatus('已复制询价摘要。');
              } catch {
                result.current?.select();
                setStatus('已选中摘要，请手动复制。');
              }
            }}
          >
            <Copy />
            复制摘要
          </button>
        </section>
      )}
      <p role="status">{status}</p>
    </>
  );
}
