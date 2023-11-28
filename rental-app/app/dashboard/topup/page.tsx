import { Metadata } from 'next';
import Form from '@/app/ui/topup-form';
import Breadcrumbs from '@/app/ui/rent/breadcrumbs';

export const metadata: Metadata = {
  title: 'Top Up',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          {
            label: 'Top Up',
            href: '/dashboard/topup',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
