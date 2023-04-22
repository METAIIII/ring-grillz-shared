import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { User as PrismaUser } from '@prisma/client';
import { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import prisma from 'shared/prisma';

declare module 'next-auth' {
  interface User {
    role: PrismaUser['role'];
  }
  interface Session {
    user: PrismaUser;
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      session.user.role = user.role;
      return session;
    },
  },
  providers: [
    EmailProvider({
      server: {
        host: `${process.env.SMTP_HOST}`,
        port: Number(process.env.SMTP_PORT ?? 465),
        auth: {
          user: `${process.env.SMTP_USER}`,
          pass: `${process.env.SMTP_PASS}`,
        },
      },
      from: `${process.env.SMTP_FROM}`,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: `${process.env.SECRET}`,
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
};
