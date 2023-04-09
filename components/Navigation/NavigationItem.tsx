import { Link, useBreakpointValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

const NavigationItem: React.FC<{
  href: string;
  label: string;
  isAdmin?: boolean;
}> = ({ href, label, isAdmin }) => {
  const { pathname } = useRouter();

  const isActive =
    href === pathname ? true : pathname.includes(href) && href !== '/' ? true : false;
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <NextLink href={href}>
      <Link
        _dark={{
          _hover: { color: isAdmin ? 'red.300' : 'yellow.400', textDecoration: 'none' },
          color: isAdmin && isActive ? 'red.400' : isActive ? 'yellow.500' : 'gray.500',
          borderColor: isAdmin && isActive ? 'red.400' : isActive ? 'yellow.500' : 'transparent',
        }}
        _light={{
          _hover: { color: isAdmin ? 'red.700' : 'yellow.700', textDecoration: 'none' },
          color: isAdmin && isActive ? 'red.600' : isActive ? 'yellow.600' : 'gray.500',
          borderColor: isAdmin && isActive ? 'red.600' : isActive ? 'yellow.600' : 'transparent',
        }}
        as='span'
        borderBottomWidth={isMobile ? 0 : 3}
        borderRightWidth={isMobile ? 4 : 0}
        fontFamily='heading'
        fontSize='xl'
        pb={isMobile ? 1 : 1}
        pt={isMobile ? 1 : 2}
        px={2}
        textTransform='uppercase'
      >
        {label}
      </Link>
    </NextLink>
  );
};

export default NavigationItem;
