'use client';
import Link from 'next/link';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { List, X, ClipboardText, ArrowUpRight } from '@phosphor-icons/react';
import { asset, agency } from '@/lib/site';
import { products } from '@/content/products';
type Items = Record<string, number>;
const Cart = createContext<{ items: Items; setQuantity: (id: string, n: number) => void }>({
  items: {},
  setQuantity: () => {},
});
export const useCart = () => useContext(Cart);
export function SiteShell({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Items>({});
  const menu = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('industrial-demo-cart') || '{}');
      const clean: Items = {};
      for (const p of products) {
        const n = saved[p.id];
        if (Number.isInteger(n) && n > 0 && n <= 9999) clean[p.id] = n;
      }
      queueMicrotask(() => setItems(clean));
    } catch {}
  }, []);
  function setQuantity(id: string, n: number) {
    if (!products.some((p) => p.id === id)) return;
    setItems((prev) => {
      const next = { ...prev };
      if (n <= 0) delete next[id];
      else next[id] = Math.max(1, Math.min(9999, Math.floor(n) || 1));
      try {
        sessionStorage.setItem('industrial-demo-cart', JSON.stringify(next));
      } catch {}
      return next;
    });
  }
  const count = Object.keys(items).length;
  const links = [
    ['产品目录', '/products/'],
    ['选型支持', '/support/'],
    ['关于我们', '/support/#about'],
  ];
  return (
    <Cart.Provider value={{ items, setQuantity }}>
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
        <Link href="/" className="brand">
          <img src={asset('images/logo.webp')} alt="" width="48" height="48" />
          工业优选
        </Link>
        <nav aria-label="主导航" className="desktop-nav">
          {links.map(([n, h]) => (
            <Link key={n} href={h}>
              {n}
            </Link>
          ))}
        </nav>
        <Link className="button outline header-list" href="/inquiry/">
          <ClipboardText />
          询价清单 <span>{count}</span>
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
          <Link href="/inquiry/" onClick={() => menu.current?.close()}>
            询价清单（{count}）
          </Link>
          <a href={agency()}>返回示例库</a>
        </nav>
      </dialog>
      {children}
      <footer className="footer">
        <div className="container">
          <div>
            <strong>工业优选</strong>
            <p>按型号找产品，按参数选配件。</p>
            <p className="muted">虚构企业 · 产品、参数和图片仅用于网站演示。</p>
          </div>
          <div>
            <a
              className="button"
              href={agency('contact/?service=corporate-website&example=industrial-catalog')}
            >
              我也要类似的网站 <ArrowUpRight />
            </a>
            <p className="muted">联系行人易安科技，定制你的企业官网</p>
          </div>
        </div>
      </footer>
      <aside className="mobile-bar" aria-label="快速操作">
        <Link className="button outline" href="/inquiry/">
          <ClipboardText />
          询价清单 {count}
        </Link>
        <Link className="button" href="/products/">
          浏览全部产品
        </Link>
      </aside>
    </Cart.Provider>
  );
}
export function AddButton({ id }: { id: string }) {
  const { items, setQuantity } = useCart();
  const [done, setDone] = useState(false);
  return (
    <>
      <button
        className="button"
        onClick={() => {
          setQuantity(id, (items[id] || 0) + 1);
          setDone(true);
        }}
      >
        加入询价清单
      </button>
      <span className="status" role="status">
        {done ? '已加入，可在询价清单修改数量。' : ''}
      </span>
    </>
  );
}
