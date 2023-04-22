import { Box, Button, Text } from '@chakra-ui/react';
import Link from 'next/link';
import Stripe from 'stripe';

interface CustomerInfoProps {
  user?: Stripe.Checkout.Session.CustomerDetails | null;
  showEdit?: boolean;
}

function CustomerInfo({ user, showEdit = false }: CustomerInfoProps) {
  return !user ? (
    <Text>No information.</Text>
  ) : (
    <Box pl={3}>
      <Text fontWeight='bold' mb={1}>
        {user?.name}
      </Text>
      {user && <Text mb={2}>{user.email}</Text>}
      {user.phone && <Text mb={2}>{user.phone}</Text>}
      <Text fontFamily='mono' lineHeight='4' mb={2} textTransform='uppercase'>
        {user?.address?.line1}
        <br />
        {user?.address?.line2}
        {user?.address?.line2 && <br />}
        {user?.address?.city}
        <br />
        {user?.address?.state} {user?.address?.postal_code}
      </Text>
      {showEdit && (
        <Link href='/account'>
          <Button size='sm'>Edit Details</Button>
        </Link>
      )}
    </Box>
  );
}

export default CustomerInfo;
