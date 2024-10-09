import path from 'path';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { User as PrismaUser } from '@prisma/client';
import { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import nodemailer from 'nodemailer';
import nodemailerMjmlPlugin from 'nodemailer-mjml';

import prisma from '../prisma';

declare module 'next-auth' {
  interface User {
    role: PrismaUser['role'];
  }
  interface Session {
    user: PrismaUser;
  }
}

const TEMPLATE_FOLDER = path.join(process.cwd(), 'email-templates');
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
// Register nodemailer-mjml to your nodemailer transport
transport.use('compile', nodemailerMjmlPlugin({ templateFolder: TEMPLATE_FOLDER }));

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
      from: `${process.env.SMTP_USER}`,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { host } = new URL(url);
        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${host}`,
          templateName: 'verify-request',
          templateData: { url, host },
        });
      },
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
