'use client';
import { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Copy, FileText, Info } from '@phosphor-icons/react';
import { samples } from '@/content/samples';
export function RequirementForm() {
  const params = useSearchParams();
  const sample = samples.find((s) => s.id === params.get('sample'));
  const [process, setProcess] = useState(sample?.process === '精密车削' ? '精密车削' : 'CNC 铣削');
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState('');
  const result = useRef<HTMLTextAreaElement>(null);
  return (
    <>
      <h1>
        先把需求，<span>说清楚。</span>
      </h1>
      <p className="intro">整理加工信息，便于后续沟通。</p>
      <div className="form-steps">
        <strong>1　加工信息</strong>
        <span />
        <span>2　需求摘要</span>
      </div>
      <form
        onChange={() => {
          setSummary('');
          setStatus('');
        }}
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const note = String(f.get('note') || '').trim();
          if (!note) {
            const el = e.currentTarget.elements.namedItem('note') as HTMLTextAreaElement;
            el.setCustomValidity('请简单说明加工用途或关注点。');
            el.reportValidity();
            return;
          }
          setSummary(
            `精工制造 · 加工需求示例（未发送）\n\n参考样件：${sample?.name || '无'}\n加工工艺：${process}\n材料：${f.get('material')}\n数量：${f.get('quantity')} 件\n期望交期：${f.get('timeline')}\n\n补充说明：${note}\n\n图纸可在后续沟通时提供。此为虚构企业演示，未向任何工厂发送。`,
          );
          setStatus('摘要已生成，仅在本机整理，未发送。');
          requestAnimationFrame(() => result.current?.focus());
        }}
      >
        <fieldset>
          <legend>加工工艺</legend>
          <div className="chips">
            {['CNC 铣削', '精密车削'].map((v) => (
              <button
                type="button"
                key={v}
                aria-pressed={process === v}
                onClick={() => {
                  setProcess(v);
                  setSummary('');
                  setStatus('');
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="field">
          材料
          <select name="material" defaultValue={sample?.material || '铝合金'}>
            <option>铝合金</option>
            <option>钢材</option>
            <option>不锈钢</option>
            <option>待沟通</option>
          </select>
        </label>
        <div className="form-grid">
          <label className="field">
            数量（件）
            <input
              name="quantity"
              type="number"
              min="1"
              max="1000000"
              step="1"
              required
              defaultValue="50"
            />
          </label>
          <label className="field">
            期望交期
            <select name="timeline">
              <option>可协商</option>
              <option>两周内</option>
              <option>一个月内</option>
            </select>
          </label>
        </div>
        <label className="field">
          补充说明
          <textarea
            name="note"
            required
            maxLength={1500}
            defaultValue={sample ? `参考${sample.name}，希望先沟通加工方案。` : ''}
            placeholder="例如：铝合金支架，小批量试制，希望先沟通加工方案。"
            onChange={(e) => e.currentTarget.setCustomValidity('')}
          />
        </label>
        <p className="muted">
          <FileText size={20} /> 图纸可在后续沟通时提供
        </p>
        <p className="form-disclosure">
          <Info size={20} /> 演示表单，仅在本机整理，不发送。
        </p>
        <button className="button form-submit" type="submit">
          生成需求摘要 <ArrowRight />
        </button>
      </form>
      {summary && (
        <section className="summary">
          <h2>需求摘要</h2>
          <textarea aria-label="加工需求摘要" ref={result} readOnly value={summary} />
          <button
            className="button outline"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(summary);
                setStatus('已复制需求摘要。');
              } catch {
                result.current?.select();
                setStatus('已选中摘要，请手动复制。');
              }
            }}
          >
            <Copy />
            复制摘要
          </button>
          <p className="muted">如需调整，可修改上方信息后重新生成。</p>
        </section>
      )}
      <p role="status">{status}</p>
      <p className="form-end">这是网站设计示例</p>
    </>
  );
}
