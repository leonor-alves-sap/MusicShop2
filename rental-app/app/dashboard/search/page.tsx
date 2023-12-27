'use client';

import { Metadata } from 'next';
import SearchForm from '@/app/ui/search-form';
import Breadcrumbs from '@/app/ui/rent/breadcrumbs';
import VinylTable from '@/app/ui/search/table';
import React, { useState } from 'react';
import { Vinyl } from '@/app/lib/definitions';
import { useEffect } from 'react';
import { getVinyls } from '@/app/lib/actions'; // Replace with your actual API function

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const [searchResults, setSearchResults] = useState<Vinyl[]>([]);

  const handleSearch = (results: Vinyl[]) => {
    setSearchResults(results);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch initial data when the component mounts
        const initialData = await getVinyls();
        setSearchResults(initialData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

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
      <VinylTable vinyls={searchResults} />
    </>
  );
}
