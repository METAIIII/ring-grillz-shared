import { useColorMode } from '@chakra-ui/react';
import { Toaster } from 'sonner';

export function ThemedToaster() {
  const { colorMode } = useColorMode();
  return <Toaster closeButton richColors duration={5000} position='top-right' theme={colorMode} />;
}
