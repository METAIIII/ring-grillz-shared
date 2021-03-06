import { Link, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

const NavigationItem: React.FC<{
  href: string;
  label: string;
  isAdmin?: boolean;
}> = ({ href, label, isAdmin }) => {
  const { pathname } = useRouter();

  const isActive =
    href === pathname
      ? true
      : pathname.includes(href) && href !== '/'
      ? true
      : false;

  const isDark = useColorModeValue(false, true);
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <NextLink href={href} passHref>
      <Link
        px={2}
        pt={isMobile ? 1 : 2}
        pb={isMobile ? 1 : 1}
        fontFamily='heading'
        fontSize='xl'
        textTransform='uppercase'
        textColor={
          isAdmin
            ? 'red.400'
            : isActive && isDark
            ? 'yellow.500'
            : isActive
            ? 'yellow.600'
            : isDark
            ? 'yellow.300'
            : 'gray.500'
        }
        borderBottomWidth={isMobile ? 0 : 3}
        borderRightWidth={isMobile ? 4 : 0}
        borderColor={
          isAdmin && isActive
            ? 'red.400'
            : isActive
            ? 'yellow.500'
            : 'transparent'
        }
        _hover={{ textColor: isDark ? 'gray.50' : 'yellow.500' }}
      >
        {label}
      </Link>
    </NextLink>
  );
};

export default NavigationItem;
