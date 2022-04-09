import { Button, Icon } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { useSWRConfig } from 'swr';

interface Props {
  orderId: string;
  checkoutId: string;
}

const ResendEmail: React.FC<Props> = ({ orderId, checkoutId }) => {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const handleClick = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/order/mail`, { orderId, checkoutId });
      mutate(`/api/order/${orderId}`);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Button
      size='sm'
      isLoading={loading}
      onClick={handleClick}
      leftIcon={<Icon as={FaEnvelope} />}
    >
      Send Receipt Email
    </Button>
  );
};

export default ResendEmail;
