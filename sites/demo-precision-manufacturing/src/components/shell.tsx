'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { List, X, ArrowUpRight, ArrowRight, ArrowLeft } from '@phosphor-icons/react';
import { asset, agency } from '@/lib/site';
export function Shell({ children }: { children: React.ReactNode }) {
  const menu = useRef<HTMLDialogElement>(null);
  const links = [
    ['加工能力', '/capabilities/'],
    ['样件展示', '/samples/'],
    ['交付流程', '/#process'],
  ];
  return (
    <>
      <a className="skip" href="#main">
        跳到主要内容
      </a>
      <div className="demo-strip">
        <div className="container">
          <span>虚构企业 · 网站设计示例</span>
          <a href={agency()}>
            返回示例库 <ArrowUpRight />
          </a>
        </div>
      </div>
      <header className="header container">
        <Link className="mobile-back" href="/">
          <ArrowLeft size={25} /> 加工需求
        </Link>
        <Link href="/" className="brand" aria-label="精工制造首页">
          <img src={asset('images/logo.webp')} alt="" width="60" height="52" />
          <span>
            精工制造<small>PRECISION WORKS</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="主导航">
          {links.map(([n, h]) => (
            <Link key={n} href={h}>
              {n}
            </Link>
          ))}
        </nav>
        <Link className="button" href="/requirements/">
          整理加工需求 <ArrowUpRight />
        </Link>
        <button
          className="menu-toggle"
          aria-label="打开导航菜单"
          onClick={() => menu.current?.showModal()}
        >
          <List size={28} />
        </button>
      </header>
      <dialog className="menu" ref={menu} aria-label="手机导航">
        <button aria-label="关闭导航菜单" onClick={() => menu.current?.close()}>
          <X size={28} />
        </button>
        <nav>
          {links.map(([n, h]) => (
            <Link key={n} href={h} onClick={() => menu.current?.close()}>
              {n}
            </Link>
          ))}
          <Link href="/requirements/" onClick={() => menu.current?.close()}>
            整理加工需求
          </Link>
          <a href={agency()}>返回示例库</a>
        </nav>
      </dialog>
      {children}
      <footer className="footer">
        <div className="container">
          <div>
            <strong>精工制造</strong>
            <p>让工艺、材料与交付要求，在开始前就清晰。</p>
            <p className="muted">虚构企业 · 工艺与样件均为网站设计示例</p>
          </div>
          <div>
            <a
              className="button"
              href={agency('contact/?service=corporate-website&example=precision-manufacturing')}
            >
              我也要类似的网站 <ArrowUpRight />
            </a>
            <p className="muted">联系行人易安科技，定制你的企业官网</p>
          </div>
        </div>
      </footer>
      <aside className="mobile-bar" aria-label="快速操作">
        <Link className="button" href="/requirements/">
          整理加工需求 <ArrowRight />
        </Link>
      </aside>
    </>
  );
}
