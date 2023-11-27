import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import axios, { AxiosResponse, AxiosError } from 'axios';

const RENTAL_API = 'http://rental:3000/api/rentals';
const BACK_OFFICE_CLIENTS = 'http://back-office:3000/api/clients';

class PasswordMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PasswordMismatchError';
  }
}

async function getUser(email: string): Promise<any> {
  try {
    const user = await axios.get(`${BACK_OFFICE_CLIENTS}/client`, {
      params: { email: email },
    });
    console.log(user);
    return user.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const isSignUp = credentials.retypePassword !== undefined;

        // If retypePassword is present, it's a signup request
        if (isSignUp) {
          const parsedCredentials = z
            .object({
              name: z.string(),
              email: z.string().email(),
              password: z.string().min(6),
              retypePassword: z.string(),
            })
            .refine((data) => {
              if (data.password !== data.retypePassword) {
                throw new PasswordMismatchError("Passwords don't match");
              }
              return true;
            })
            .parse(credentials);

          const { email, password, name } = parsedCredentials;
          const newUser = await createUser(email, password, name);
          return newUser;
        } else {
          const parsedCredentials = z
            .object({
              email: z.string().email(),
              password: z.string().min(6),
            })
            .parse(credentials);

          const { email, password } = parsedCredentials;
          const user = await getUser(email);

          if (user && (await bcrypt.compare(password, user.password))) {
            return user;
          }

          console.log('Invalid login credentials');
          return null;
        }
      },
    }),
  ],
});

export async function createUser(
  email: string,
  password: string,
  name: string,
): Promise<User | null> {
  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = await sql<User>`
        INSERT INTO users (email, password, name)
        VALUES (${email}, ${hashedPassword}, ${name})
        RETURNING *
      `;

    return newUser.rows[0];
  } catch (error) {
    console.error('Failed to create user:', error);
    return null;
  }
}
