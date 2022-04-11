import { Container } from '@chakra-ui/react';
import { Token } from '@chakra-ui/styled-system/dist/declarations/src/utils';
import { OrderType } from '@prisma/client';
import * as CSS from 'csstype';

import Header from '../components/Header';

interface Props {
  mode: OrderType;
  size: Token<CSS.Property.MaxWidth | number, "sizes">;
}

const Layout: React.FC<Props> = ({ children, size, mode }) => {
  return (
    <>
      <Header mode={mode} />
      <Container as="main" p={0} maxW={size}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
