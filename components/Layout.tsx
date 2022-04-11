import { Container } from '@chakra-ui/react';
import { Token } from '@chakra-ui/styled-system/dist/declarations/src/utils';
import { OrderType } from '@prisma/client';
import * as CSS from 'csstype';
import { NextSeo } from 'next-seo';

import Header from '../components/Header';

interface Props {
  title?: string;
  mode: OrderType;
  size: Token<CSS.Property.MaxWidth | number, "sizes">;
}

const Layout: React.FC<Props> = ({ children, mode, size, title }) => {
  return (
    <>
      <NextSeo title={title} />
      <Header mode={mode} />
      <Container as="main" p={0} maxW={size}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
