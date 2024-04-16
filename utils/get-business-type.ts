import { OrderType } from '@prisma/client';

export function getBusinessType(orderType: OrderType) {
  if (orderType === 'GRILLZ') {
    return 'Dr Grillz';
  }
  if (orderType === 'RING') {
    return 'Ring Kingz';
  }
  return '';
}
