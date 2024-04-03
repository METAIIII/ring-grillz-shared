import { Container } from '@chakra-ui/react';
import { OrderType } from '@prisma/client';
import { NextSeo } from 'next-seo';
import { createContext, PropsWithChildren, useContext } from 'react';
import { FullGrillzMaterial, FullRing } from 'shared/types';

import Header from './Header';

interface LayoutContextType<T extends OrderType = OrderType> {
  mode: T;
  data: T extends 'GRILLZ' ? FullGrillzMaterial[] : FullRing[];
}

const LayoutContext = createContext<LayoutContextType>({
  data: [],
  mode: 'GRILLZ',
});

export function useLayoutContext<T extends OrderType>() {
  return useContext(LayoutContext) as LayoutContextType<T>;
}

interface LayoutProps<T extends OrderType> extends PropsWithChildren<LayoutContextType<T>> {
  maxW?: string;
  title?: string;
  showHeader?: boolean;
}

function Layout<T extends OrderType>({
  children,
  data,
  mode,
  maxW,
  title = 'IIII',
  showHeader = true,
}: LayoutProps<T>) {
  return (
    <LayoutContext.Provider value={{ data, mode }}>
      <NextSeo title={title} />
      {showHeader && <Header mode={mode} />}
      <Container as='main' maxW={maxW} p={8}>
        {children}
      </Container>
    </LayoutContext.Provider>
  );
}

export default Layout;
