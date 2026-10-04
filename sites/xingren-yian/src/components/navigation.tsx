'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, List, X, Pause, Play, Planet } from '@phosphor-icons/react';

const navLinks = [
  ['服务能力', '/#services'],
  ['双端体验', '/#experience'],
  ['交付流程', '/#process'],
  ['关于我们', '/#about'],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  function close() {
    dialog.current?.close();
    setOpen(false);
    toggle.current?.focus();
  }
  function show() {
    dialog.current?.showModal();
    setOpen(true);
  }
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="wordmark" aria-label="行人易安科技首页">
          <span className="brand-dot" aria-hidden="true">
            <Planet size={33} weight="duotone" />
          </span>
          行人易安科技
        </Link>
        <nav className="desktop-nav" aria-label="主导航">
          {navLinks.map(([name, href]) => (
            <Link key={href} href={href}>
              {name}
            </Link>
          ))}
        </nav>
        <Link className="header-contact" href="/contact/?service=corporate-website">
          聊聊建站需求 <ArrowUpRight size={16} />
        </Link>
        <button
          className="menu-toggle"
          ref={toggle}
          onClick={show}
          aria-label="打开导航菜单"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <List size={28} weight="light" />
        </button>
      </div>
      <dialog
        id="mobile-menu"
        className="mobile-menu"
        ref={dialog}
        onCancel={close}
        onClose={() => setOpen(false)}
      >
        <div className="menu-top">
          <span className="wordmark">行人易安科技</span>
          <button onClick={close} aria-label="关闭导航菜单">
            <X size={28} />
          </button>
        </div>
        <p className="eyebrow">EXPLORE THE POSSIBILITIES</p>
        <nav aria-label="手机导航">
          {navLinks.map(([name, href], i) => (
            <Link key={href} href={href} onClick={close}>
              <span>0{i + 1}</span>
              {name}
              <ArrowUpRight size={24} />
            </Link>
          ))}
        </nav>
        <Link href="/contact/" className="button button-primary" onClick={close}>
          聊聊你的需求 <ArrowUpRight size={18} />
        </Link>
        <p className="menu-note">从你的下一步，开始聊起。</p>
      </dialog>
    </header>
  );
}
export function MobileContactBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => {
      const hero = document.querySelector('[data-primary-cta]');
      const end = document.querySelector('[data-contact-section]');
      const heroRect = hero?.getBoundingClientRect();
      const endRect = end?.getBoundingClientRect();
      const editing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '');
      const contactVisible = !!endRect && endRect.top < window.innerHeight && endRect.bottom > 0;
      setVisible(!!heroRect && heroRect.bottom < 0 && !contactVisible && !editing);
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    document.addEventListener('focusin', update);
    document.addEventListener('focusout', update);
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      document.removeEventListener('focusin', update);
      document.removeEventListener('focusout', update);
    };
  }, [pathname]);
  if (!visible || pathname.includes('/contact')) return null;
  return (
    <aside className="mobile-contact-bar" aria-label="快速咨询">
      <span>有想法，一起实现。</span>
      <Link href="/contact/" className="button button-primary">
        聊聊项目需求 <ArrowUpRight size={16} />
      </Link>
    </aside>
  );
}
export function MotionControl() {
  const [paused, setPaused] = useState(false);
  return (
    <button
      className="motion-control"
      aria-label={paused ? '开启装饰动画' : '暂停装饰动画'}
      aria-pressed={paused}
      onClick={() => {
        const next = !paused;
        setPaused(next);
        document.documentElement.dataset.motion = next ? 'paused' : 'active';
      }}
    >
      {paused ? <Play size={14} /> : <Pause size={14} />}
      <span>{paused ? '开启动效' : '暂停动效'}</span>
    </button>
  );
}
