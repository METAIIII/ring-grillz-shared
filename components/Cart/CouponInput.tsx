import { Input, InputGroup, InputLeftElement, InputRightElement, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { IoTicketOutline } from 'react-icons/io5';
import { useAppDispatch } from 'reducers/store';

import useDebounce from '../../hooks/use-debounce';
import { useGetCouponByCodeQuery } from '../../reducers/api';
import { setCouponCode } from '../../reducers/cart';

export function CouponInput() {
  const dispatch = useAppDispatch();
  const [code, setCode] = useState('');
  const queryCode = useDebounce(code, 500);

  const { data, isFetching, isLoading } = useGetCouponByCodeQuery(queryCode, {
    skip: !queryCode,
  });

  const coupon = data?.data;

  // Handle coupon code from query string in URL
  const router = useRouter();
  const defaultCode = router.query.coupon as string;
  useEffect(() => {
    if (defaultCode) {
      setCode(defaultCode);
      dispatch(setCouponCode(defaultCode));
    }
  }, [defaultCode, dispatch]);

  const handleCode = (value: string) => {
    setCode(value);
    dispatch(setCouponCode(value));
  };

  return (
    <InputGroup>
      <InputLeftElement color='gray.300' pointerEvents='none'>
        <IoTicketOutline />
      </InputLeftElement>
      <Input
        _placeholder={{
          fontWeight: 'normal',
        }}
        fontWeight='bold'
        placeholder='Coupon code'
        value={code}
        onChange={(e) => handleCode(e.target.value)}
      />
      <InputRightElement
        color={`${
          isLoading || isFetching
            ? 'gray'
            : coupon?.valid
              ? 'green'
              : queryCode && !coupon
                ? 'red'
                : 'gray'
        }.300`}
        pointerEvents='none'
      >
        {isFetching || isLoading ? (
          <Spinner />
        ) : coupon?.valid ? (
          <AiOutlineCheck />
        ) : queryCode && !coupon ? (
          <AiOutlineClose />
        ) : (
          ''
        )}
      </InputRightElement>
    </InputGroup>
  );
}
