import { Container } from '@chakra-ui/react';
import { OrderType } from '@prisma/client';
import { NextSeo } from 'next-seo';
import { createContext, PropsWithChildren } from 'react';
import Header from './Header';

interface LayoutProps {
  title?: string;
  mode: OrderType;
  maxW: string;
}

export const LayoutContext = createContext<{ mode?: OrderType }>({});

const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({ children, mode, maxW, title }) => {
  return (
    <LayoutContext.Provider value={{ mode }}>
      <NextSeo title={title} />
      <Header mode={mode} />
      <Container as='main' maxW={maxW} p={0}>
        {children}
      </Container>
    </LayoutContext.Provider>
  );
};

export default Layout;
