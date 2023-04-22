import { Container } from '@chakra-ui/react';
import { OrderType } from '@prisma/client';
import { NextSeo } from 'next-seo';
import { createContext, PropsWithChildren } from 'react';
import Header from './Header';

interface LayoutProps {
  title?: string;
  mode: OrderType;
  maxW: string;
  showHeader?: boolean;
}

export const LayoutContext = createContext<{ mode?: OrderType }>({});

function Layout({
  children,
  mode,
  maxW,
  title,
  showHeader = true,
}: PropsWithChildren<LayoutProps>) {
  return (
    <LayoutContext.Provider value={{ mode }}>
      <NextSeo title={title} />
      {showHeader && <Header mode={mode} />}
      <Container as='main' maxW={maxW} p={8}>
        {children}
      </Container>
    </LayoutContext.Provider>
  );
}

export default Layout;
