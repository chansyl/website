'use client';
import { useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowUpRight, Copy, EnvelopeSimple } from '@phosphor-icons/react';
import { services } from '@/content/services';
import { site } from '@/lib/site';
import { reportRequirementSummary } from '@/lib/analytics';
export function ContactForm() {
  const params = useSearchParams();
  const requested = params.get('service');
  const [selection, setService] = useState<string | null>(null);
  const service =
    selection || (services.some((s) => s.slug === requested) ? requested! : 'corporate-website');
  const [summary, setSummary] = useState('');
  const [message, setMessage] = useState('');
  const result = useRef<HTMLDivElement>(null);
  const summaryField = useRef<HTMLTextAreaElement>(null);
  function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (key: string) => String(form.get(key) || '').trim();
    if (!value('needs')) {
      const field = event.currentTarget.elements.namedItem('needs') as HTMLTextAreaElement;
      field.setCustomValidity('请简单描述你的项目想法。');
      field.reportValidity();
      return;
    }
    const name = services.find((s) => s.slug === service)?.name || '项目定制';
    const generatedSummary = `你好，行人易安科技！\n\n我想咨询：${name}\n企业 / 称呼：${value('company') || '待沟通'}\n\n项目想法：\n${value('needs')}\n\n期望时间：${value('timeline') || '一起讨论'}\n预算范围：${value('budget') || '一起评估'}\n联系方式：${value('contact') || '通过当前渠道沟通'}\n\n期待进一步了解合作方式。`;
    setSummary(generatedSummary);
    reportRequirementSummary(generatedSummary);
    setMessage('摘要已生成。可复制到微信，或打开邮件继续沟通。');
    requestAnimationFrame(() => {
      result.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
        block: 'center',
      });
      result.current?.focus({ preventScroll: true });
    });
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      setMessage('已复制需求摘要，可以粘贴到邮件或聊天窗口。');
    } catch {
      summaryField.current?.focus();
      summaryField.current?.select();
      setMessage('浏览器未允许自动复制，已选中摘要，请手动复制。');
    }
  }
  return (
    <div>
      <form className="brief-form" onSubmit={generate}>
        <fieldset>
          <legend>你想打造什么？</legend>
          <div className="service-choices">
            {services.map((s) => (
              <label className="service-choice" key={s.slug}>
                <input
                  type="radio"
                  name="service"
                  value={s.slug}
                  checked={service === s.slug}
                  onChange={() => setService(s.slug)}
                />
                <span>{s.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="field">
          <label htmlFor="company">
            企业 / 称呼<span>选填</span>
          </label>
          <input
            id="company"
            name="company"
            maxLength={80}
            autoComplete="organization"
            placeholder="希望我们怎么称呼你？"
          />
        </div>
        <div className="field">
          <label htmlFor="needs">
            说说你的想法<span>必填</span>
          </label>
          <textarea
            id="needs"
            name="needs"
            required
            maxLength={1500}
            onChange={(e) => e.currentTarget.setCustomValidity('')}
            placeholder="例如：我们是一家制造企业，希望展示产品与服务。网站需要兼顾电脑和手机，方便客户了解并联系。"
          />
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="timeline">
              期望时间<span>选填</span>
            </label>
            <select id="timeline" name="timeline">
              <option value="">一起讨论</option>
              <option>1 个月内</option>
              <option>1–3 个月</option>
              <option>3 个月以后</option>
              <option>先了解方案</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="budget">
              预算范围<span>选填</span>
            </label>
            <input id="budget" name="budget" placeholder="如：希望先评估" maxLength={60} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="contact">
            你的联系方式<span>选填</span>
          </label>
          <input
            id="contact"
            name="contact"
            autoComplete="off"
            placeholder="邮箱、电话或微信，任选一种"
            maxLength={120}
          />
        </div>
        <p className="form-note">
          点击“整理我的需求”将向行人易安科技发送需求摘要（含你填写的联系方式），用于需求沟通统计。你也可以复制摘要或通过自己的邮箱继续联系。
        </p>
        <button className="button button-primary" type="submit">
          整理我的需求 <ArrowUpRight size={19} />
        </button>
      </form>
      {summary && (
        <div className="brief-result" ref={result} tabIndex={-1}>
          <h2>你的需求摘要</h2>
          <textarea
            aria-label="需求摘要，可编辑"
            ref={summaryField}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <div className="result-actions">
            <button className="button button-outline" onClick={copy}>
              <Copy size={18} />
              复制摘要
            </button>
            <a
              className="button button-primary"
              href={`mailto:${site.email}?subject=${encodeURIComponent('项目需求咨询 · 行人易安科技')}&body=${encodeURIComponent(summary)}`}
              onClick={() =>
                setMessage(
                  '将打开你的邮件应用，请确认内容并点击发送。若未打开，可复制摘要并发送至下方邮箱。',
                )
              }
            >
              <EnvelopeSimple size={18} />
              通过邮件发送
            </a>
          </div>
          <p className="status-message" role="status">
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
