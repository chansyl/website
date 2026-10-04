import { Suspense } from 'react';
import { RequirementForm } from '@/components/requirement-form';
export const metadata = { title: '加工需求' };
export default function Page() {
  return (
    <main id="main" className="light-section requirements">
      <div className="container section narrow">
        <Suspense fallback={<h1>加工需求</h1>}>
          <RequirementForm />
        </Suspense>
      </div>
    </main>
  );
}
