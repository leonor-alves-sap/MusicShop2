'use client';

import { Metadata } from 'next';
import SearchForm from '@/app/ui/search-form';
import Breadcrumbs from '@/app/ui/rent/breadcrumbs';
import VinylTable from '@/app/ui/search/table';
import React, { useState, useEffect } from 'react';
import { Vinyl } from '@/app/lib/definitions';
import { getVinyls } from '@/app/lib/actions'; // Replace with your actual API function

const Page: React.FC = () => {
  const [vinyls, setVinyls] = useState<Vinyl[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVinyls = async () => {
      try {
        const fetchedVinyls = await getVinyls();
        console.log(fetchedVinyls);
        if (fetchedVinyls != null) {
          setVinyls(fetchedVinyls);
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Error fetching vinyls:', error.message);
        setLoading(false);
      }
    };

    fetchVinyls();
  }, []);

  return (
    <>
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
      <VinylTable vinyls={vinyls} />;
    </>
  );
};

export default Page;
