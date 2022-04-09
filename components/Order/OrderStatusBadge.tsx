import { Badge, BadgeProps } from '@chakra-ui/react';
import { OrderStatus } from '@prisma/client';

const OrderStatusBadge: React.FC<BadgeProps & { orderStatus: OrderStatus }> = ({
  orderStatus,
  ...props
}) => {
  return (
    <Badge
      px={2}
      py={1}
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
      {...props}
    >
      {orderStatus}
    </Badge>
  );
};

export default OrderStatusBadge;
