import ProfileForm from '@/app/ui/profile-form';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/rent/breadcrumbs';

export const metadata: Metadata = {
  title: 'Profile',
};

export default function ProfilePage() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          {
            label: 'Profile',
            href: '/dashboard/profile',
            active: true,
          },
        ]}
      />
      <ProfileForm />
    </main>
  );
}
