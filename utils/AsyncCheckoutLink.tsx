import { Link } from '@chakra-ui/react';
import React from 'react';
import useSWR from 'swr';

import { FullCheckoutResponse } from '../types/apiResponses';
import fetcher from './axiosFetcher';

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
      href={data?.data?.url ?? "#"}
      target={data?.data?.url ? "_blank" : "_self"}
      rel="noreferrer"
    >
      {children}
    </Link>
  ) : null;
};

export default AsyncCheckoutLink;
