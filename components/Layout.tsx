import { Container } from '@chakra-ui/react';
import { OrderType } from '@prisma/client';
import { NextSeo } from 'next-seo';
import { createContext, PropsWithChildren } from 'react';
import { FullUser } from '../types';
import Header from './Header';

interface LayoutProps {
  title?: string;
  mode: OrderType;
  maxW: string;
  user?: FullUser;
}

export const LayoutContext = createContext<{ mode?: OrderType }>({});

function Layout({ children, mode, maxW, title, user }: PropsWithChildren<LayoutProps>) {
  return (
    <LayoutContext.Provider value={{ mode }}>
      <NextSeo title={title} />
      <Header mode={mode} user={user} />
      <Container as='main' maxW={maxW} p={0}>
        {children}
      </Container>
    </LayoutContext.Provider>
  );
}

export default Layout;
