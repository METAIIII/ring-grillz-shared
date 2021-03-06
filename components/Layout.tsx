import { Container } from '@chakra-ui/react';
import { Token } from '@chakra-ui/styled-system/dist/declarations/src/utils';
import { OrderType } from '@prisma/client';
import * as CSS from 'csstype';
import { NextSeo } from 'next-seo';
import { createContext, PropsWithChildren } from 'react';

import { DrGrillzHeader, IHeaderProps, RingKingzHeader } from '../components/Header';

interface LayoutProps {
  title?: string;
  mode: OrderType;
  size: Token<CSS.Property.MaxWidth | number, 'sizes'>;
  headerProps?: IHeaderProps;
}

export const LayoutContext = createContext<{ mode?: OrderType }>({});

const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  children,
  mode,
  size,
  title,
  headerProps,
}) => {
  return (
    <LayoutContext.Provider value={{ mode }}>
      <NextSeo title={title} />
      {mode === 'GRILLZ' ? (
        <DrGrillzHeader />
      ) : (
        <RingKingzHeader {...headerProps} />
      )}
      <Container as='main' p={0} maxW={size}>
        {children}
      </Container>
    </LayoutContext.Provider>
  );
};

export default Layout;
