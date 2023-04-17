import { Flex, Heading, Text, Wrap } from '@chakra-ui/react';
import { useMemo } from 'react';

import { Panel } from 'shared/components/UI/Panel';
import { useGetCouponsQuery } from 'shared/reducers/api';
import { formatAmountForDisplay } from 'shared/utils/stripeHelpers';
import { DeleteCoupon } from './DeleteCoupon';

const CouponList = () => {
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
              {coupon.amount_off && formatAmountForDisplay(coupon.amount_off)}
              {coupon.percent_off && `${coupon.percent_off}%`}
            </Text>
          </Flex>
          <DeleteCoupon buttonProps={{ size: 'sm' }} couponId={coupon.id} />
        </Panel>
      ))}
    </Wrap>
  );
};

export default CouponList;
