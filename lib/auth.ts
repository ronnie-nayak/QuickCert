import NextAuth, { DefaultSession } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db, schema } from './db';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { and, eq } from 'drizzle-orm';
import { v4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

export type { Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      type: 'client' | 'admin' | 'notInitialized';
      adminCenter?: string;
    } & DefaultSession['user'];
  }
}

export * from 'next-auth/react';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub,
    Google,
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        type: {
          label: 'Type',
          type: 'select',
          options: ['login', 'register']
        },
        name: {
          label: 'Username',
          type: 'text',
          placeholder: 'Enter your full name'
        },
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const hashedPassword = bcrypt.hashSync(
          credentials.password as string,
          10
        );
        const userExists = await db
          .select()
          .from(schema.users)
          .where(
            and(
              // eq(schema.users.name, credentials.name as string),
              eq(schema.users.email, credentials.email as string)
              // eq(schema.users.hashedPassword, hashedPassword)
            )
          );

        if (!userExists[0]) {
          if (credentials.type === 'login') {
            throw new Error('User does not exist', {
              cause: {
                error: 'User does not exist'
              }
            });
          } else {
            const temp = await db
              .insert(schema.users)
              .values({
                id: `${v4()}`,
                name: credentials.name as string,
                email: credentials.email as string,
                hashedPassword: hashedPassword,
                type: 'notInitialized'
              })
              .returning();
            return temp[0];
          }
        } else {
          if (
            !bcrypt.compareSync(
              credentials.password as string,
              userExists[0].hashedPassword!
            )
          ) {
            if (credentials.type === 'login') {
              throw new Error('Password is incorrect', {
                cause: {
                  error: 'Password is incorrect'
                }
              });
            } else {
              throw new Error('User already exists', {
                cause: {
                  error: 'User already exists'
                }
              });
            }
          }
        }

        return userExists[0];
      }
    })
  ],

  callbacks: {
    session: async ({ session }) => {
      const sessionUsers = await db
        .select()
        .from(schema.users)
        .where(
          and(
            eq(schema.users.name, session?.user?.name!),
            eq(schema.users.email, session?.user?.email!)
          )
        );
      const sessionUser = sessionUsers[0];

      return {
        ...session,
        user: {
          ...session.user,
          id: sessionUser?.id,
          type: sessionUser?.type,
          adminCenter: sessionUser?.adminCenter
        }
      } as any;
    }
    // signIn: async ({ profile, user }) => {
    //   console.log(user, profile, "signIn")
    //   return true
    // }
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60 // 1 hours
  },
  trustHost: true
});
