'use client';

import React, { ChangeEvent, useState, useEffect } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { getUser, topUp } from '../lib/actions';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';

const rentalEndpoint = 'http://rental:3000/api/rentals';
const clientEndpoint = 'http://back-office:3000/api/clients';

export default function Form() {
  const [topupAmount, setTopupAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [loading, setLoading] = useState(true);

  //const { data: session } = useSession() || {};
  const router = useRouter();

  const handleTopupChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTopupAmount(event.target.value);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace the following line with your getUser function call
        const userData = await getUser('roy_kent@afcrichmond.com');
        setCurrentAmount(userData?.balance?.toString() || ''); // Use optional chaining and provide a default value
        console.log(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Update total amount whenever topupAmount or currentAmount changes
    const total = parseFloat(topupAmount) + parseFloat(currentAmount);
    setTotalAmount(isNaN(total) ? '' : total.toString());
  }, [topupAmount, currentAmount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const userData = await getUser('roy_kent@afcrichmond.com');
      console.log('User Data:', userData);
      if (userData) {
        console.log('User Data:', userData);

        // Call the topUp function with the email and topupAmount
        const response = await topUp(userData.email, parseFloat(topupAmount));

        // Handle the response as needed
        console.log('Top Up Response:', response);
        const confirmation = window.confirm(
          `Balance updated successfully. Your balance is now ${response?.balance}`,
        );
        // Redirect back to the dashboard if the user confirms
        if (confirmation) {
          router.push('/dashboard');
        } else {
          console.log('User canceled the update.');
          await topUp(userData.email, -parseFloat(topupAmount));
        }
      }
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Current Amount */}
        <div className="mb-4">
          <label
            htmlFor="currentAmount"
            className="mb-2 block text-sm font-medium"
          >
            Current Amount
          </label>
          <div className="relative">
            <div
              id="total"
              className="peer block h-[50px] w-full rounded-md border border-gray-200 py-4 pl-10 text-sm outline-2 placeholder:text-gray-500"
              style={{ userSelect: 'none', outline: 'none' }}
            >
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {currentAmount !== '' ? (
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(parseFloat(currentAmount))
                  ) : (
                    <p>Error loading current amount.</p>
                  )}
                </>
              )}
            </div>
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Top Up Value */}
        <div className="mb-4">
          <label htmlFor="topup" className="mb-2 block text-sm font-medium">
            Top Up Amount
          </label>
          <div className="relative">
            <input
              id="topup"
              name="topup"
              type="number"
              placeholder="Enter USD amount"
              value={topupAmount}
              onChange={handleTopupChange}
              className="peer block h-[50px] w-full rounded-md border border-gray-200 py-4 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Total */}
        <div className="mb-4">
          <label htmlFor="total" className="mb-2 block text-sm font-medium">
            Total
          </label>
          <div className="relative">
            <div
              id="total"
              className="peer block h-[50px] w-full rounded-md border border-gray-200 py-6 pl-10 text-sm outline-2 placeholder:text-gray-500"
              style={{ userSelect: 'none', outline: 'none' }}
            >
              {isNaN(parseFloat(totalAmount)) ? (
                ''
              ) : (
                <>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(parseFloat(totalAmount))}
                </>
              )}
            </div>
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Buttons */}
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
  );
}
