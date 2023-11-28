'use client';

import React, { ChangeEvent, useState, useEffect } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { getUser } from '../lib/actions';
import { useSession } from 'next-auth/react';

const rentalEndpoint = 'http://rental:3000/api/rentals';
const clientEndpoint = 'http://back-office:3000/api/clients';

export default function Form() {
  const [topupAmount, setTopupAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession() || {};

  const handleTopupChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTopupAmount(event.target.value);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace the following line with your getUser function call
        const userData = await getUser('roy_kent@richmondfc.com');
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
    console.log('Form Submitted!');
    console.log('Rental endpoint is:', rentalEndpoint);
    try {
      console.log('API Request:', {
        email: 'roy_kent@richmondfc.com', // Use the user's email from the session
        balance: parseFloat(topupAmount) + parseFloat(currentAmount),
      });
      const response = await fetch(`${clientEndpoint}/update-balance`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'roy_kent@richmondfc.com', // Replace with the actual email
          balance: parseFloat(topupAmount),
        }),
      });
      console.log('API response', response);

      if (!response.ok) {
        // Handle error responses
        console.error('Error updating balance:', response.statusText);
      } else {
        // Handle successful response
        const data = await response.json();
        console.log(data.message);
      }
    } catch (error: any) {
      console.error('Error updating balance:', error.message);
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
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div
                id="total"
                className="peer block w-full rounded-md border border-gray-200 py-4 pl-10 text-sm outline-2 placeholder:text-gray-500"
                style={{ userSelect: 'none', outline: 'none' }}
              >
                {currentAmount !== '' ? (
                  <>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(parseFloat(currentAmount))}
                  </>
                ) : (
                  <p>Error loading current amount.</p>
                )}
              </div>
            )}
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
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
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
              className="peer block w-full rounded-md border border-gray-200 py-4 pl-10 text-sm outline-2 placeholder:text-gray-500"
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
                  <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </>
              )}
            </div>
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
