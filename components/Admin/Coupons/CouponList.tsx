import { Badge, Flex, Heading, Text, Wrap } from '@chakra-ui/react';
import { useMemo } from 'react';

import { Panel } from 'shared/components/UI/Panel';
import { useGetCouponsQuery } from 'shared/reducers/api';
import { formatCouponDiscount } from 'shared/utils/getTotals';
import { DeleteCoupon } from './DeleteCoupon';

function CouponList() {
  const { data } = useGetCouponsQuery('');
  const couponsData = useMemo(() => {
    if (data?.data) {
      return data.data;
    } else {
      return [];
    }
  }, [data]);

  return (
    <Wrap spacing={4}>
      {couponsData.map((coupon) => (
        <Panel key={coupon.id} minW='64'>
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
        </Panel>
      ))}
    </Wrap>
  );
}

export default CouponList;
