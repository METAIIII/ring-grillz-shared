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
    <NextLink legacyBehavior passHref href={href}>
      <Link
        _hover={{ textColor: isDark ? 'gray.50' : 'yellow.500' }}
        borderBottomWidth={isMobile ? 0 : 3}
        borderColor={
          isAdmin && isActive
            ? 'red.400'
            : isActive
            ? 'yellow.500'
            : 'transparent'
        }
        borderRightWidth={isMobile ? 4 : 0}
        fontFamily='heading'
        fontSize='xl'
        pb={isMobile ? 1 : 1}
        pt={isMobile ? 1 : 2}
        px={2}
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
        textTransform='uppercase'
      >
        {label}
      </Link>
    </NextLink>
  );
};

export default NavigationItem;
