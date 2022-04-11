import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { UserResponse } from '../types/apiResponses';
import fetcher from '../utils/axiosFetcher';

import fetcher from '../shared/utils/axiosFetcher';

const useUser = () => {
  const { data: sessionData } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const { data } = useSWR<UserResponse>(
    sessionData?.user?.email ? `/api/user/${sessionData.user.email}` : null,
    fetcher,
    { refreshInterval: 1000 }
  );

  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
    }
  }, [data]);

  return user;
};

export default useUser;
