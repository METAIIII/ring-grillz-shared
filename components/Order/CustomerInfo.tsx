import { Button, Text } from '@chakra-ui/react';
import Link from 'next/link';
import Stripe from 'stripe';

interface CustomerInfoProps {
  user?: Stripe.Customer;
  shipping?: Stripe.Checkout.Session.Shipping;
  showEdit?: boolean;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  user,
  shipping,
  showEdit = false,
}) => {
  return !user && !shipping ? (
    <Text>No information.</Text>
  ) : (
    <>
      <Text mb={1} fontWeight='bold'>
        {shipping?.name}
      </Text>
      {user && <Text mb={2}>{user.email}</Text>}
      <Text lineHeight='4' textTransform='uppercase' fontFamily='mono' mb={2}>
        {shipping?.address?.line1}
        <br />
        {shipping?.address?.line2}
        {shipping?.address?.line2 && <br />}
        {shipping?.address?.city}
        <br />
        {shipping?.address?.state} {shipping?.address?.postal_code}
      </Text>
      {showEdit && (
        <Link href='/account' passHref>
          <Button as='a' size='sm'>
            Edit Details
          </Button>
        </Link>
      )}
    </>
  );
};

export default CustomerInfo;
