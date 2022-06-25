import { Badge, Box, Button, Heading, Icon, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { FaClock, FaEnvelope, FaShippingFast, FaStripeS } from 'react-icons/fa';
import Stripe from 'stripe';

import CustomerInfo from '../../components/Order/CustomerInfo';
import ResendEmail from '../../components/Order/ResendEmail';
import { FullOrder } from '../../types';
import { FullCheckoutSession } from '../../types/stripe';
import { formatAmountForDisplay } from '../../utils/stripeHelpers';

interface Props {
  order: FullOrder;
  checkout?: FullCheckoutSession;
  itemsList: React.ReactNode;
}

const OrderSummary: React.FC<Props> = ({ order, checkout, itemsList }) => {
  const customer = checkout?.customer as Stripe.Customer | undefined;
  const shipping = checkout?.shipping as
    | Stripe.Checkout.Session.Shipping
    | undefined;

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={4}>
      <Box>
        <Heading size='md' fontFamily='body' p={2} mb={2} borderBottomWidth={1}>
          Customer Details
        </Heading>
        <CustomerInfo user={customer} shipping={shipping} />
      </Box>
      <Box>
        <Heading size='md' fontFamily='body' p={2} mb={2} borderBottomWidth={1}>
          Order Details
        </Heading>
        <Box px={2}>
          <Text as='div'>
            <Icon as={FaClock} mr={2} />
            {dayjs(order.createdAt).format('LLL')}
          </Text>
          <Stack spacing={1} alignItems='flex-start'>
            <Badge fontFamily='mono'>ID: {order.id}</Badge>
            <Badge
              colorScheme={
                order.status === 'PAID' || order.status === 'SHIPPED'
                  ? 'green'
                  : order.status === 'PENDING'
                  ? 'orange'
                  : 'red'
              }
            >
              {`Status: ${order?.status ?? ''}`}
            </Badge>
            {order?.hasSentOrderEmail && order.hasSentReceiptEmail && (
              <Badge colorScheme='teal' display='flex' alignItems='center'>
                <Icon as={FaEnvelope} mr={1} /> Emails sent
              </Badge>
            )}
            {order.status === 'SHIPPED' && (
              <Badge colorScheme='blue' display='flex' alignItems='center'>
                <Icon as={FaShippingFast} mr={1} /> Order Shipped
              </Badge>
            )}
          </Stack>
          {checkout?.payment_intent?.charges.data[0]?.receipt_url && (
            <Box pt={2}>
              <Button
                as='a'
                href={
                  checkout?.payment_intent?.charges.data[0]?.receipt_url ?? ''
                }
                target='_blank'
                size='sm'
                colorScheme='purple'
                leftIcon={<Icon as={FaStripeS} />}
              >
                Stripe Receipt
              </Button>
            </Box>
          )}
          {checkout?.url && (
            <Box pt={2}>
              <Button
                as='a'
                href={checkout.url}
                target='_blank'
                size='sm'
                colorScheme='purple'
                leftIcon={<Icon as={FaStripeS} />}
              >
                Continue Checkout
              </Button>
            </Box>
          )}
          {!order.hasSentReceiptEmail && checkout && (
            <Box pt={2}>
              <ResendEmail orderId={order.id} checkoutId={checkout.id} />
            </Box>
          )}
          <Text fontWeight='bold' mt={2} py={1} borderBottomWidth={1}>
            Items
          </Text>
          {itemsList}
          <Box>
            <Text fontSize='2xl' textAlign='right'>
              {formatAmountForDisplay(checkout?.amount_total ?? 0)}
            </Text>
          </Box>
        </Box>
      </Box>
    </SimpleGrid>
  );
};

export default OrderSummary;
