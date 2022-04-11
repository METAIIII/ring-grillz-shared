import { Link } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';
import useSWR from 'swr';

import { FullCheckoutResponse } from '../types/apiResponses';
import fetcher from './axiosFetcher';

interface AsyncCheckoutLinkProps {
  checkoutId: string;
}

const AsyncCheckoutLink: React.FC<PropsWithChildren<AsyncCheckoutLinkProps>> = ({
  children,
  checkoutId,
}) => {
  const { data } = useSWR<FullCheckoutResponse>(`/api/checkout/${checkoutId}`, fetcher);
  return !!data ? (
    <Link
      href={data?.data?.url ?? '#'}
      rel='noreferrer'
      target={data?.data?.url ? '_blank' : '_self'}
    >
      {children}
    </Link>
  ) : null;
};

export default AsyncCheckoutLink;
