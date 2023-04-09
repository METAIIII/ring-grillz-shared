import { Box, BoxProps } from '@chakra-ui/react';

export function Panel(props: BoxProps) {
  return (
    <Box
      _dark={{ bg: 'gray.800' }}
      _light={{ bg: 'gray.50' }}
      borderRadius={12}
      borderWidth={1}
      boxShadow='md'
      p={4}
      {...props}
    >
      {props.children}
    </Box>
  );
}
