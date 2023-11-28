import { Metadata } from 'next';
import SearchForm from '@/app/ui/search-form';
import Breadcrumbs from '@/app/ui/rent/breadcrumbs';

export const metadata: Metadata = {
  title: 'Search',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          {
            label: 'Search',
            href: '/dashboard/search',
            active: true,
          },
        ]}
      />
      <SearchForm />
    </main>
  );
}
