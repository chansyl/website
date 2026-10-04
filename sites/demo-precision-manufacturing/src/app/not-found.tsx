import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="container section">
      <h1>这一页没有找到</h1>
      <p>请返回首页继续浏览示例。</p>
      <Link className="button" href="/">
        返回首页
      </Link>
    </main>
  );
}
