import { Button, Icon } from '@chakra-ui/react';
import { FaEnvelope } from 'react-icons/fa';

import { useSendOrderEmailMutation } from '../../reducers/api';

interface Props {
  orderId: string;
  checkoutId: string;
}

function ResendEmail({ orderId, checkoutId }: Props) {
  const [sendEmails, { isLoading }] = useSendOrderEmailMutation();

  return (
    <Button
      isLoading={isLoading}
      leftIcon={<Icon as={FaEnvelope} />}
      size='sm'
      onClick={() => sendEmails({ orderId, checkoutId })}
    >
      Send Receipt Email
    </Button>
  );
}

export default ResendEmail;
