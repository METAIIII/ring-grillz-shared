import React from 'react';
import { Badge, Box, Button, Heading, Icon, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { FaClock, FaEnvelope, FaShippingFast, FaStripeS } from 'react-icons/fa';
import Stripe from 'stripe';

import { useUpdateOrderMutation } from '../../reducers/api';
import { FullOrder } from '../../types';
import { formatAmountForDisplay } from '../../utils/stripe-helpers';
import CustomerInfo from './customer-info';

interface Props {
  order: FullOrder;
  checkout?: Stripe.Checkout.Session;
  itemsList: React.ReactNode;
}

function OrderSummary({ order, checkout, itemsList }: Props) {
  const customer = checkout?.customer_details;
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} mb={4} spacing={8}>
      <Box>
        <Heading borderBottomWidth={1} mb={2} p={2} size='md'>
          Customer Details
        </Heading>
        <CustomerInfo user={customer} />
      </Box>
      <Box>
        <Heading borderBottomWidth={1} mb={2} p={2} size='md'>
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
          {checkout?.url && order.status === 'PENDING' && (
            <Stack pt={2}>
              <Button
                as='a'
                colorScheme='yellow'
                href={checkout.url}
                leftIcon={<Icon as={FaStripeS} />}
                size='sm'
                target='_blank'
              >
                Continue checkout
              </Button>
              <Button
                colorScheme='red'
                isLoading={isLoading}
                size='sm'
                variant='ghost'
                onClick={() =>
                  updateOrder({
                    id: order.id,
                    data: { status: 'CANCELED' },
                  })
                }
              >
                Cancel order
              </Button>
            </Stack>
          )}
          <Text borderBottomWidth={1} fontWeight='bold' mt={2} py={1}>
            Items
          </Text>
          {itemsList}
          <Text fontSize='2xl' fontWeight={700} textAlign='right'>
            {formatAmountForDisplay(checkout?.amount_total || order.paymentAmount || 0)}
          </Text>
        </Box>
      </Box>
    </SimpleGrid>
  );
}

export default OrderSummary;
