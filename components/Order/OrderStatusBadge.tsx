import { Badge, BadgeProps } from '@chakra-ui/react';
import { OrderStatus } from '@prisma/client';

function OrderStatusBadge({ orderStatus, ...props }: BadgeProps & { orderStatus: OrderStatus }) {
  return (
    <Badge
      colorScheme={
        orderStatus === 'PAID'
          ? 'green'
          : orderStatus === 'PENDING'
          ? 'orange'
          : orderStatus === 'CANCELED'
          ? 'red'
          : orderStatus === 'SHIPPED'
          ? 'blue'
          : orderStatus === 'UNPAID'
          ? 'purple'
          : 'grey'
      }
      px={2}
      py={1}
      {...props}
    >
      {orderStatus}
    </Badge>
  );
}

export default OrderStatusBadge;
