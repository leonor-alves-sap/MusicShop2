import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Page() {
  return (
    <main>
      <div className="flex-grow bg-gray-200">
        {/* Your image component or content goes here */}
        <div style={{ width: `100%`, height: `90vh` }}>
          <Image
            src="/dashboard-img.jpg"
            alt="Image Content"
            width={6720}
            height={4480}
            className="h-full w-full rounded-md object-cover"
          />
        </div>
      </div>
    </main>
  );
}
