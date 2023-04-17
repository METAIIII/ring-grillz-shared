import { Badge, Box, Button, Heading, Icon, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { FaClock, FaEnvelope, FaShippingFast, FaStripeS } from 'react-icons/fa';

import Stripe from 'stripe';
import CustomerInfo from '../../components/Order/CustomerInfo';
import ResendEmail from '../../components/Order/ResendEmail';
import { FullOrder } from '../../types';
import { formatAmountForDisplay } from '../../utils/stripeHelpers';

interface Props {
  order: FullOrder;
  checkout?: Stripe.Checkout.Session;
  itemsList: React.ReactNode;
}

const OrderSummary: React.FC<Props> = ({ order, checkout, itemsList }) => {
  const customer = checkout?.customer_details;

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} mb={4} spacing={8}>
      <Box>
        <Heading borderBottomWidth={1} fontFamily='body' mb={2} p={2} size='md'>
          Customer Details
        </Heading>
        <CustomerInfo user={customer} />
      </Box>
      <Box>
        <Heading borderBottomWidth={1} fontFamily='body' mb={2} p={2} size='md'>
          Order Details
        </Heading>
        <Box px={2}>
          <Text as='div'>
            <Icon as={FaClock} mr={2} />
            {dayjs(order.createdAt).format('LLL')}
          </Text>
          <Stack alignItems='flex-start' spacing={1}>
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
              <Badge alignItems='center' colorScheme='teal' display='flex'>
                <Icon as={FaEnvelope} mr={1} /> Emails sent
              </Badge>
            )}
            {order.status === 'SHIPPED' && (
              <Badge alignItems='center' colorScheme='blue' display='flex'>
                <Icon as={FaShippingFast} mr={1} /> Order Shipped
              </Badge>
            )}
          </Stack>
          {checkout?.url && (
            <Box pt={2}>
              <Button
                as='a'
                colorScheme='purple'
                href={checkout.url}
                leftIcon={<Icon as={FaStripeS} />}
                size='sm'
                target='_blank'
              >
                Continue Checkout
              </Button>
            </Box>
          )}
          {!order.hasSentReceiptEmail && checkout && order.status === 'PAID' && (
            <Box pt={2}>
              <ResendEmail checkoutId={checkout.id} orderId={order.id} />
            </Box>
          )}
          <Text borderBottomWidth={1} fontWeight='bold' mt={2} py={1}>
            Items
          </Text>
          {itemsList}
          <Text fontSize='2xl' fontWeight={700} textAlign='right'>
            {formatAmountForDisplay(checkout?.amount_total ?? 0)}
          </Text>
        </Box>
      </Box>
    </SimpleGrid>
  );
};

export default OrderSummary;
