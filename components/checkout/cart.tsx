import { useMemo } from 'react';
import { Box, Flex, Heading, Icon, List, Text, Tooltip } from '@chakra-ui/react';
import { OrderType } from '@prisma/client';
import { GiShoppingCart } from 'react-icons/gi';
import { IoTicketOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import Stripe from 'stripe';

import { removeItem } from '../../reducers/cart';
import { FullCoupon } from '../../types';
import { formatCouponDiscount } from '../../utils/get-totals';
import { formatAmountForDisplay } from '../../utils/stripe-helpers';
import CartItem from './cart-item';
import Checkout from './checkout';

export interface CartProps {
  cartItems: CartItem[];
  cartItemComponent: (item: CartItem) => React.ReactElement;
  cartTotal: number;
  coupon: FullCoupon | null;
  couponCode: string;
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  orderType: OrderType;
}

function Cart({
  cartItems,
  cartItemComponent,
  cartTotal,
  coupon,
  couponCode,
  lineItems,
  orderType,
}: CartProps) {
  const dispatch = useDispatch();

  const total = useMemo(() => {
    if (coupon) {
      if (!coupon.valid) {
        return cartTotal;
      }
      if (coupon.percent_off) {
        return cartTotal - cartTotal * (coupon.percent_off / 100);
      }
      if (coupon.amount_off) {
        return cartTotal - coupon.amount_off;
      }
    }
    return cartTotal;
  }, [cartTotal, coupon]);

  const isCouponApplied = total < cartTotal;

  return (
    <>
      <Flex alignItems='center' mb={2}>
        <Icon as={GiShoppingCart} fontSize='2xl' mr={2} />
        <Heading lineHeight={0} size='md'>
          Your Cart {cartItems.length > 0 && `(${cartItems.length})`}
        </Heading>
        <Tooltip
          hidden={!isCouponApplied}
          label={`Was ${formatAmountForDisplay(cartTotal)}`}
          placement='top'
        >
          <Box ml='auto' textAlign='right'>
            <Heading
              _dark={{ color: isCouponApplied ? 'green.300' : 'gray.50' }}
              _light={{ color: isCouponApplied ? 'green.500' : 'gray.900' }}
              fontSize='3xl'
              fontWeight={700}
              lineHeight={isCouponApplied ? 1 : undefined}
            >
              {formatAmountForDisplay(total ?? 0)}
            </Heading>
            {isCouponApplied && (
              <Flex
                _dark={{ color: 'gray.200' }}
                _light={{ color: 'gray.900' }}
                alignItems='center'
                fontSize='sm'
                justifyContent='flex-end'
              >
                <IoTicketOutline />
                <Text fontWeight={700} ml={2}>
                  {formatCouponDiscount(coupon?.amount_off, coupon?.percent_off)}
                </Text>
              </Flex>
            )}
          </Box>
        </Tooltip>
      </Flex>
      <Box>
        <List borderBottomWidth={1} mb={4}>
          {cartItems.map((cartItem, i) => {
            return (
              <CartItem
                key={`${i}-cartItem`}
                cartItem={cartItem}
                onRemove={() => dispatch(removeItem(cartItem))}
              >
                {cartItemComponent(cartItem)}
              </CartItem>
            );
          })}
        </List>
        <Checkout couponCode={couponCode} lineItems={lineItems} orderType={orderType} />
      </Box>
    </>
  );
}

export default Cart;
