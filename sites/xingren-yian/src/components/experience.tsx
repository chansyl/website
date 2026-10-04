'use client';
import { useEffect, useState } from 'react';
import { Desktop, DeviceMobile, ArrowUpRight, Check } from '@phosphor-icons/react';
import { asset } from '@/lib/site';
export function Experience() {
  const [mode, setMode] = useState<'mobile' | 'desktop'>('mobile');
  const [demo, setDemo] = useState<'intro' | 'service'>('intro');
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setMode(media.matches ? 'desktop' : 'mobile');
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return (
    <div className="experience-layout">
      <div className="experience-copy">
        <p className="eyebrow">DESIGNED FOR EVERY SCREEN</p>
        <h2>
          同一个官网，
          <br />
          <em>每一块屏幕都用心。</em>
        </h2>
        <p className="section-description">
          客户可能在电脑前比较产品，也可能在手机上点开你分享的链接。让品牌形象保持一致，让每一次访问都清晰、顺手。
        </p>
        <div className="experience-points">
          <div>
            <Desktop size={24} />
            <h3>电脑上，看得全面</h3>
            <p>舒展版面与完整资料，方便深入了解、浏览细节。</p>
          </div>
          <div>
            <DeviceMobile size={24} />
            <h3>手机上，用得顺手</h3>
            <p>重要内容优先，文字易读，菜单与咨询随手可达。</p>
          </div>
        </div>
      </div>
      <div className="experience-stage">
        <div className="view-switch" role="group" aria-label="选择布局演示">
          <button onClick={() => setMode('mobile')} aria-pressed={mode === 'mobile'}>
            <DeviceMobile size={17} />
            手机体验
          </button>
          <button onClick={() => setMode('desktop')} aria-pressed={mode === 'desktop'}>
            <Desktop size={18} />
            电脑体验
          </button>
        </div>
        <div
          className={`demo-viewport demo-${mode}`}
          aria-label={`${mode === 'mobile' ? '手机' : '电脑'}布局演示`}
        >
          <div className="demo-navigation">
            <span>
              YOUR BRAND<span className="demo-brand-mark">®</span>
            </span>
            <button
              onClick={() => setDemo(demo === 'intro' ? 'service' : 'intro')}
              aria-label={demo === 'intro' ? '演示：查看服务' : '演示：返回首页'}
            >
              {demo === 'intro' ? '服务' : '首页'} <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="demo-body">
            <div className="demo-text">
              <span className="demo-kicker">为每一个好想法</span>
              <h3>
                {demo === 'intro' ? (
                  <>
                    让品牌，
                    <br />
                    被认真看见。
                  </>
                ) : (
                  <>
                    你的业务，
                    <br />
                    值得专属设计。
                  </>
                )}
              </h3>
              <p>{demo === 'intro' ? '清晰表达，连接更多可能。' : '理解需求，打造合适的体验。'}</p>
              <button onClick={() => setDemo(demo === 'intro' ? 'service' : 'intro')}>
                {demo === 'intro' ? '了解我们的服务' : '返回品牌首页'} <ArrowUpRight size={12} />
              </button>
            </div>
            <img src={asset('images/planet.webp')} alt="" width="260" height="260" loading="lazy" />
          </div>
          <div className="demo-bottom">
            <span>
              <Check size={12} />
              清晰的品牌表达
            </span>
            <span>
              <Check size={12} />
              合适的阅读节奏
            </span>
          </div>
        </div>
        <p className="demo-caption">布局演示 · 同一份内容，两种浏览方式</p>
      </div>
    </div>
  );
}
