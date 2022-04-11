import { Container } from '@chakra-ui/react';
import { OrderType } from '@prisma/client';
import { NextSeo } from 'next-seo';
import { createContext, PropsWithChildren } from 'react';

interface LayoutProps {
  title?: string;
  mode: OrderType;
  size: string;
  headerComponent?: JSX.Element;
}

export const LayoutContext = createContext<{ mode?: OrderType }>({});

const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  children,
  mode,
  size,
  title,
  headerComponent,
}) => {
  return (
    <LayoutContext.Provider value={{ mode }}>
      <NextSeo title={title} />
      {headerComponent}
      <Container as='main' maxW={size} p={0}>
        {children}
      </Container>
    </LayoutContext.Provider>
  );
};

export default Layout;
