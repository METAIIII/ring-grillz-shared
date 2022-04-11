import { Button, Icon } from '@chakra-ui/react';
import { Order } from '@prisma/client';
import axios from 'axios';
import React, { useState } from 'react';
import { FaCheck, FaSquare } from 'react-icons/fa';
import { useSWRConfig } from 'swr';

import { OrderResponse } from '../../../types/apiResponses';

interface Props {
  order: Order;
}

const MarkAsShipped: React.FC<Props> = ({ order }) => {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const isShipped = order.status === "SHIPPED";

  const handleClick = async () => {
    setLoading(true);
    try {
      await axios.patch<OrderResponse>(`/api/order/${order.id}`, {
        status: isShipped ? "PAID" : "SHIPPED",
      });
      mutate(`/api/order?status=SHIPPED`);
      mutate(`/api/order?status=PAID`);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <Button
      isLoading={loading}
      colorScheme="blue"
      leftIcon={<Icon as={isShipped ? FaCheck : FaSquare} />}
      onClick={handleClick}
    >
      {isShipped ? "Shipped" : "Mark as sent"}
    </Button>
  );
};

export default MarkAsShipped;
