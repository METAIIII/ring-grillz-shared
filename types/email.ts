import { OrderType } from '@prisma/client';

export type EmailTemplate =
  | 'bug-report-admin'
  | 'order-confirmation'
  | 'order-confirmation-admin'
  | 'custom-order-confirmation'
  | 'custom-order-confirmation-admin';

export interface BugReportAdminVars {
  message: string;
  customerName: string;
  customerEmail: string;
}

export interface OrderConfirmationVars {
  orderID: string;
  viewOrderURL: string;
}
export interface OrderConfirmationAdminVars {
  orderID: string;
  viewOrderURL: string;
  customerEmail: string;
}

export interface CustomOrderConfirmationVars {
  message: string;
}
export interface CustomOrderConfirmationAdminVars {
  message: string;
  customerName: string;
  customerEmail: string;
}

export type EmailRequestBody = {
  [K in EmailTemplate]: {
    template: K;
    subject: string;
    recipient: string | string[];
    replyTo?: string;
    vars: EmailVarsMap[K];
    orderType: OrderType;
  };
}[EmailTemplate];

interface EmailVarsMap {
  'bug-report-admin': BugReportAdminVars;
  'order-confirmation': OrderConfirmationVars;
  'order-confirmation-admin': OrderConfirmationAdminVars;
  'custom-order-confirmation': CustomOrderConfirmationVars;
  'custom-order-confirmation-admin': CustomOrderConfirmationAdminVars;
}
