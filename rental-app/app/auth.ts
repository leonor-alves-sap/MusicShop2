import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { getUser, createUser } from './lib/actions';

class PasswordMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PasswordMismatchError';
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

          // if (user && (await bcrypt.compare(password, user.password))) {
          //   return user;
          // }
          if (user && password == user.password) {
            return user;
          }

          console.log('Invalid login credentials');
          return null;
        }
      },
    }),
  ],
});
