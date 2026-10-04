import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="container not-found">
      <p className="eyebrow">404 · A DIFFERENT ORBIT</p>
      <h1>这一页，暂时不在航线上。</h1>
      <p>地址可能已变更，让我们回到起点继续探索。</p>
      <Link href="/" className="button button-primary">
        回到首页
      </Link>
    </main>
  );
}
