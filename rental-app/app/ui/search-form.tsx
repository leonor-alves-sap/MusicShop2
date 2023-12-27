'use client';

import React, { ChangeEvent, useState, useEffect } from 'react';
import {
  AtSymbolIcon,
  CakeIcon,
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MagnifyingGlassCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import {
  getVinylsByArtist,
  getVinylsByGenre,
  getVinylsByTitle,
} from '../lib/actions';

// Results are passed onto the table component
interface SearchFormProps {
  onSearch: (results: any) => void;
}
const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('');
  const [query, setQuery] = useState('');
  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSearchType(event.target.value);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      switch (searchType) {
        case 'artist':
          var searchResults = await getVinylsByArtist(query);
          break;
        case 'genre':
          var searchResults = await getVinylsByGenre(query);
          break;
        case 'title':
          var searchResults = await getVinylsByTitle(query);
          break;
      }
      onSearch(searchResults); // Set the search results in the state
      console.log(searchResults);
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Search Type */}
          <div className="mb-4">
            <label htmlFor="type" className="mb-2 block text-sm font-medium">
              Type
            </label>
            <div className="relative">
              <select
                id="type"
                name="type"
                value={searchType}
                onChange={handleTypeChange}
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              >
                <option value="" disabled>
                  Search for...
                </option>
                <option value="title">Title</option>
                <option value="artist">Artist</option>
                <option value="genre">Genre</option>
              </select>
              <MagnifyingGlassCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Query */}
          <div className="mb-4">
            <label htmlFor="query" className="mb-2 block text-sm font-medium">
              Query
            </label>
            <div className="relative">
              <input
                id="query"
                name="query"
                type="string"
                value={query}
                onChange={handleQueryChange}
                placeholder=""
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <MagnifyingGlassCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
