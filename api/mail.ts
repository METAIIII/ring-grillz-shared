import { OrderType } from '@prisma/client';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../prisma';
import { handleApiError } from './error';

const SENDGRID_API_KEY = process.env.SMTP_PASS;
sgMail.setApiKey(SENDGRID_API_KEY ?? '');

const sendOrderEmail = async (params: {
  orderID: string;
  customerEmail: string;
  orderStatus: string;
  orderType: OrderType;
}) => {
  try {
    const msg: MailDataRequired = {
      to: process.env.ORDER_EMAIL,
      from: 'services@metaiiii.online',
      replyTo: 'info@drgrillz.com',
      //   TODO get ring kings template
      templateId: params.orderType === 'GRILLZ' ? 'd-f5ecee371d18484da62d7177cdd41af7' : '',
      dynamicTemplateData: params,
    };

    await sgMail.send(msg);

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: 'Unknown error.' };
    }
  }
};

const sendReceiptEmail = async (params: {
  orderID: string;
  customerEmail: string;
  orderType: OrderType;
}) => {
  try {
    const msg: MailDataRequired = {
      to: params.customerEmail,
      from: 'services@metaiiii.online',
      replyTo: 'info@drgrillz.com',
      //   TODO get ring kings template
      templateId: params.orderType === 'GRILLZ' ? 'd-741ecc565dfe4ad795065bd5e9ec575b' : '',
      dynamicTemplateData: params,
    };

    await sgMail.send(msg);

    return { error: null };
  } catch (error) {
    return { error: 'Cannot send email' };
  }
};

export const handleMail = async (
  req: NextApiRequest,
  res: NextApiResponse,
  orderType: OrderType
) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }

  const body = req.body as {
    orderId: string;
    checkoutId: string;
  };

  try {
    const orderData = await prisma.order.findUnique({
      where: {
        id: body.orderId,
      },
    });

    if (!orderData) {
      res.status(404).end('Order not found');
      return;
    }

    if (!orderData.hasSentOrderEmail) {
      await sendOrderEmail({
        orderID: orderData.id,
        customerEmail: orderData.email,
        orderStatus: orderData.status,
        orderType,
      });
      await prisma.order.update({
        where: { id: orderData.id },
        data: { hasSentOrderEmail: true },
      });
    }

    if (!orderData.hasSentReceiptEmail) {
      await sendReceiptEmail({
        orderID: orderData.id,
        customerEmail: orderData.email,
        orderType,
      });
      await prisma.order.update({
        where: { id: orderData.id },
        data: { hasSentReceiptEmail: true },
      });
    }
    res.status(201).send({ error: null, success: true });
  } catch (error) {
    await handleApiError(res, Error(`${error}`));
  }
};
