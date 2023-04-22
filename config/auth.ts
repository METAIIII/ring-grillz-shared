import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import prisma from 'shared/prisma';

export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers
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

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {},
};
