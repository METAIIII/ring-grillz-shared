import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Link, useBreakpointValue } from '@chakra-ui/react';

function NavigationItem({
  href,
  label,
  isAdmin,
}: {
  href: string;
  label: string;
  isAdmin?: boolean;
}) {
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
          _hover: { color: isAdmin ? 'red.500' : 'yellow.600', textDecoration: 'none' },
          color: isAdmin && isActive ? 'red.500' : isActive ? 'yellow.600' : 'gray.500',
          borderColor: isAdmin && isActive ? 'red.500' : isActive ? 'yellow.600' : 'transparent',
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
}

export default NavigationItem;
