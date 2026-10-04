import { Suspense } from 'react';
import { Catalog } from '@/components/catalog';
export const metadata = { title: '产品目录' };
export default function Page() {
  return (
    <main id="main" className="container section">
      <Suspense fallback={<h1>产品目录</h1>}>
        <Catalog />
      </Suspense>
    </main>
  );
}
