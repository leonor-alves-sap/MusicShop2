'use server';

import { signIn } from '@/app/auth';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { AuthError } from 'next-auth';
import { Vinyl } from '@/app/lib/definitions';

const rentalEndpoint = 'http://rental:3000/api/rentals';
const clientEndpoint = 'http://back-office:3000/api/clients';

export async function createUser(
  email: string,
  password: string,
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

export const getVinylsByTitle = async (
  title: string,
): Promise<Vinyl[] | null> => {
  try {
    const response = await fetch(`${rentalEndpoint}/vinyl/?title=${title}`);
    if (!response.ok) {
      throw new Error('Error fetching vinyl data by title');
    }

    const vinylData: any[] = await response.json();
    const vinyls: Vinyl[] = vinylData.map((vinylData) => ({
      id: vinylData.id,
      artist: vinylData.artist,
      genre: vinylData.genre,
      title: vinylData.title,
      entranceDate: new Date(vinylData.entranceDate), // Assuming entranceDate is a string
      price: vinylData.price,
      stock: vinylData.stock,
    }));
    return vinyls;
  } catch (error: any) {
    console.error('Error:', error.message);
    return null; // Handle the error gracefully in your application
  }
};

export const getVinylsByArtist = async (
  artist: string,
): Promise<Vinyl[] | null> => {
  try {
    const response = await fetch(
      `${rentalEndpoint}/by-artist/?artist=${artist}`,
    );
    if (!response.ok) {
      throw new Error('Error fetching vinyl data by artist');
    }

    const vinylData: any[] = await response.json();
    const vinyls: Vinyl[] = vinylData.map((vinylData) => ({
      id: vinylData.id,
      artist: vinylData.artist,
      genre: vinylData.genre,
      title: vinylData.title,
      entranceDate: new Date(vinylData.entranceDate), // Assuming entranceDate is a string
      price: vinylData.price,
      stock: vinylData.stock,
    }));
    return vinyls;
  } catch (error: any) {
    console.error('Error:', error.message);
    return null; // Handle the error gracefully in your application
  }
};

export const rentVinyl = async (
  title: string,
  email: string,
): Promise<any | null> => {
  try {
    const response = await fetch(`${rentalEndpoint}/rent`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        title: title,
      }),
    });
    if (!response.ok) {
      throw new Error('Error renting vinyl.');
    }

    const message = await response.json();
    return message;
  } catch (error: any) {
    console.error('Error:', error.message);
    return null; // Handle the error gracefully in your application
  }
};

export const getVinylsByGenre = async (
  genre: string,
): Promise<Vinyl[] | null> => {
  try {
    const response = await fetch(`${rentalEndpoint}/by-genre/?genre=${genre}`);
    if (!response.ok) {
      throw new Error('Error fetching vinyl data by genre');
    }

    const vinylData: any[] = await response.json();
    const vinyls: Vinyl[] = vinylData.map((vinylData) => ({
      id: vinylData.id,
      artist: vinylData.artist,
      genre: vinylData.genre,
      title: vinylData.title,
      entranceDate: new Date(vinylData.entranceDate), // Assuming entranceDate is a string
      price: vinylData.price,
      stock: vinylData.stock,
    }));
    return vinyls;
  } catch (error: any) {
    console.error('Error:', error.message);
    return null; // Handle the error gracefully in your application
  }
};

export const getVinyls = async (): Promise<Vinyl[] | null> => {
  try {
    const response = await fetch(`${rentalEndpoint}/all-vinyls`);
    if (!response.ok) {
      throw new Error('Error fetching all vinyl data');
    }

    const vinylData: any[] = await response.json();
    const vinyls: Vinyl[] = vinylData.map((vinylData) => ({
      id: vinylData.id,
      artist: vinylData.artist,
      genre: vinylData.genre,
      title: vinylData.title,
      entranceDate: new Date(vinylData.entranceDate), // Assuming entranceDate is a string
      price: vinylData.price,
      stock: vinylData.stock,
    }));
    return vinyls;
  } catch (error: any) {
    console.error('Error:', error.message);
    return null; // Handle the error gracefully in your application
  }
};

export const returnVinyl = async (
  title: string,
  email: string,
): Promise<any | null> => {
  try {
    const response = await fetch(`${rentalEndpoint}/return`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        title: title,
      }),
    });
    if (!response.ok) {
      throw new Error('Error returning vinyl');
    }

    const message = await response.json();
    return message;
  } catch (error: any) {
    console.error('Error:', error.message);
    return null; // Handle the error gracefully in your application
  }
};

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
    await signIn('credentials', formData);
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
