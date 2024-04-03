import { Badge, Card, CardBody, Flex, Heading, Text, Wrap } from '@chakra-ui/react';
import { FullCoupon } from 'shared/types';
import { formatCouponDiscount } from 'shared/utils/get-totals';

import { DeleteCoupon } from './DeleteCoupon';

export function CouponList({ coupons }: { coupons: FullCoupon[] }) {
  return (
    <Wrap spacing={4}>
      {coupons.map((coupon) => (
        <Card key={coupon.id} minW='64'>
          <CardBody>
            <Flex alignItems='center' mb={1}>
              <Heading as='h3' size='md'>
                {coupon.name}
              </Heading>
              <Text
                _dark={{ color: 'gray.300' }}
                _light={{ color: 'gray.600' }}
                fontSize='sm'
                fontWeight={700}
                ml='auto'
              >
                {formatCouponDiscount(coupon.amount_off, coupon.percent_off)}
              </Text>
            </Flex>
            <Flex mb={4}>
              <Badge colorScheme={!coupon.promotion ? 'red' : undefined}>
                {!coupon.promotion ? 'No promo code' : coupon.promotion.code}
              </Badge>
              {coupon.times_redeemed > 0 && (
                <Badge colorScheme='green' ml={2}>
                  {coupon.times_redeemed} redeemed
                </Badge>
              )}
            </Flex>
            <DeleteCoupon buttonProps={{ size: 'sm' }} couponId={coupon.id} />
          </CardBody>
        </Card>
      ))}
    </Wrap>
  );
}
