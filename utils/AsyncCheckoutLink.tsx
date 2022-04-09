import { Link } from '@chakra-ui/react';
import React from 'react';
import useSWR from 'swr';

import fetcher from '../shared/utils/axiosFetcher';
import { FullCheckoutResponse } from '../types/apiResponses';

interface Props {
  checkoutId: string;
}

const AsyncCheckoutLink: React.FC<Props> = ({ children, checkoutId }) => {
  const { data } = useSWR<FullCheckoutResponse>(
    `/api/checkout/${checkoutId}`,
    fetcher
  );
  return !!data ? (
    <Link
      href={data?.data?.url ?? '#'}
      target={data?.data?.url ? '_blank' : '_self'}
      rel='noreferrer'
    >
      {children}
    </Link>
  ) : null;
};

export default AsyncCheckoutLink;
