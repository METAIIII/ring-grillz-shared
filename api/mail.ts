import path from 'path';
import nodemailer from 'nodemailer';
import { nodemailerMjmlPlugin } from 'nodemailer-mjml';

import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../prisma';
import { ApiResponse } from '../types/api-responses';
import { EmailRequestBody } from '../types/email';
import { getBusinessType } from '../utils/get-business-type';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
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

async function mailHandler(req: NextApiRequest, res: NextApiResponse<ApiResponse<string>>) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  try {
    if (!req.body) {
      res.status(400).json({ error: 'No body' });
      return;
    }
    const { template, vars, subject, recipient, replyTo, orderType } = req.body as EmailRequestBody;
    await transport.sendMail({
      from: `"${getBusinessType(orderType)}" <${ADMIN_EMAIL}>`,
      to: recipient,
      subject: subject,
      templateName: template,
      templateData: vars,
      replyTo: replyTo,
    });
    if (template === 'order-confirmation') {
      await prisma.order.update({
        where: { id: vars.orderID },
        data: { hasSentReceiptEmail: true },
      });
    }
    if (template === 'order-confirmation-admin') {
      await prisma.order.update({
        where: { id: vars.orderID },
        data: { hasSentOrderEmail: true },
      });
    }
    res.status(200).json({ data: 'Email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}

export default mailHandler;
