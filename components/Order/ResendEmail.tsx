import { Button, Icon } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';

interface Props {
  orderId: string;
  checkoutId: string;
}

const ResendEmail: React.FC<Props> = ({ orderId, checkoutId }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/order/mail`, { orderId, checkoutId });
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Button isLoading={loading} leftIcon={<Icon as={FaEnvelope} />} size='sm' onClick={handleClick}>
      Send Receipt Email
    </Button>
  );
};

export default ResendEmail;
