import path from 'path';
import nodemailer from 'nodemailer';
import nodemailerMjmlPlugin from 'nodemailer-mjml';

import { EmailRequestBody } from '../types/email';
import { getBusinessType } from '../utils/get-business-type';

export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const TEMPLATE_FOLDER = path.join(process.cwd(), 'src', 'email-templates');

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

export async function sendEmail({
  template,
  vars,
  subject,
  recipient,
  replyTo,
  orderType,
}: EmailRequestBody) {
  await transport.sendMail({
    from: `"${getBusinessType(orderType)}" <${ADMIN_EMAIL}>`,
    to: recipient,
    subject: subject,
    templateName: template,
    templateData: vars,
    replyTo: replyTo,
  });
}
