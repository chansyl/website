import { Inquiry } from '@/components/inquiry';
export const metadata = { title: '询价清单' };
export default function Page() {
  return (
    <main id="main" className="container section narrow">
      <Inquiry />
    </main>
  );
}
