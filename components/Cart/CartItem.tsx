import { Icon, IconButton, ListItem } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { FaTimes } from 'react-icons/fa';

import type { CartItem } from '../../reducers/cart';

type CartItemProps = PropsWithChildren<{
  cartItem: CartItem;
  onRemove: (cartItem: CartItem) => void;
}>;

function CartItem({ children, cartItem, onRemove }: CartItemProps) {
  return (
    <ListItem
      _dark={{ _hover: { bgColor: 'rgba(45, 51, 57, 0.5)' } }}
      _light={{ _hover: { bgColor: 'rgba(215, 219, 224, 0.5)' } }}
      alignItems='center'
      borderRadius={4}
      display='flex'
      mb={1}
      p={2}
    >
      {children}
      <IconButton
        aria-label='Remove'
        icon={<Icon as={FaTimes} />}
        ml='auto'
        size='sm'
        onClick={() => onRemove(cartItem)}
      />
    </ListItem>
  );
}

export default CartItem;
