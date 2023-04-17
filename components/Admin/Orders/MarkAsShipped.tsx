import { Button, Icon } from '@chakra-ui/react';
import { Order } from '@prisma/client';
import { FaCheck } from 'react-icons/fa';

import { useUpdateOrderMutation } from 'shared/reducers/api';

interface Props {
  order: Order;
}

const MarkAsShipped: React.FC<Props> = ({ order }) => {
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();
  const isShipped = order.status === 'SHIPPED';

  return (
    <Button
      colorScheme='blue'
      isLoading={isLoading}
      leftIcon={isShipped ? <Icon as={FaCheck} /> : undefined}
      onClick={() =>
        updateOrder({ id: order.id, data: { status: isShipped ? 'PAID' : 'SHIPPED' } })
      }
    >
      {isShipped ? 'Shipped' : 'Mark as sent'}
    </Button>
  );
};

export default MarkAsShipped;
