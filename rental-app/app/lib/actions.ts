'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/app/auth';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { AuthError } from 'next-auth';
import { hasExternalOtelApiPackage } from 'next/dist/build/webpack-config';

const rentalEndpoint = 'http://rental:3000/api/rentals';
const clientEndpoint = 'http://back-office:3000/api/clients';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
  INSERT INTO invoices (customer_id, amount, status, date)
  VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Invoice',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Invoice',
    };
  }
  revalidatePath('/dashboard/invoices');
}

export async function createUser(
  email: string,
  password: string,
  name: string,
): Promise<User | null> {
  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await fetch(`${clientEndpoint}/client`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        name: name,
        password: hashedPassword,
        balance: 0.0,
      }),
    });
    if (!response.ok) {
      throw new Error('Error creating user');
    }

    const message = await response.json();
    return message;
  } catch (error: any) {
    console.error('Error:', error.message);
    return null; // Handle the error gracefully in your application
  }
}

export const getUser = async (email: string): Promise<User | null> => {
  try {
    const response = await fetch(`${clientEndpoint}/client/?email=${email}`);
    if (!response.ok) {
      throw new Error('Error fetching user data');
    }

    const userData: User = await response.json();
    return userData;
  } catch (error: any) {
    console.error('Error:', error.message);
    return null; // Handle the error gracefully in your application
  }
};

export const updateUser = async (userData: any): Promise<any> => {
  try {
    if (!userData) {
      throw new Error('Invalid request parameters');
    }

    const response = await fetch(`${clientEndpoint}/update-client`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        balance: userData.balance,
      }),
    });
    if (!response.ok) {
      throw new Error('Error updating user');
    }

    const message = await response.json();
    return message;
  } catch (error: any) {
    console.error('Error:', error.message);
    return null; // Handle the error gracefully in your application
  }
};

export const topUp = async (
  email: string,
  topupAmount: number,
): Promise<any> => {
  try {
    if (!email || !topupAmount) {
      throw new Error('Invalid request parameters');
    }

    const response = await fetch(`${clientEndpoint}/balance`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        balance: topupAmount,
      }),
    });
    if (!response.ok) {
      throw new Error('Error updating balance');
    }

    const message = await response.json();
    return message;
  } catch (error: any) {
    console.error('Error:', error.message);
    return null; // Handle the error gracefully in your application
  }
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData, { callbackUrl: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
