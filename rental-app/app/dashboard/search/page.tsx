'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@/app/lib/breadcrumbs';
import VinylTable from '@/app/ui/search/table';
import SearchForm from '@/app/ui/search/search-form';
import { Vinyl } from '@/app/lib/definitions';
import { getVinyls } from '@/app/lib/actions'; // Replace with your actual API function

const Page: React.FC = () => {
  const [vinyls, setVinyls] = useState<Vinyl[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVinyls = async () => {
      try {
        const fetchedVinyls = await getVinyls();
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

  const handleSearch = async (searchResults: Vinyl[]) => {
    // Handle search results here
    setVinyls(searchResults);
  };

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
      <SearchForm onSearch={handleSearch} />
      <VinylTable vinyls={vinyls} />
    </>
  );
};

export default Page;
