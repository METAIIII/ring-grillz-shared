import {
  Box,
  BoxProps,
  CardBody,
  CardFooter,
  CardHeader,
  Card as ChakraCard,
  Icon,
} from '@chakra-ui/react';

import { CardProps, useCard } from './use-card';

export function Card({
  children,
  title,
  icon,
  footer,
  glow,
  shine,
  onClick,
  isLoading,
  isError,
  cardBodyProps,
  cardFooterProps,
  cardHeaderProps,
  ...rest
}: CardProps & BoxProps) {
  const { setIsHovered, cardRef, glowStyle, shineStyle, loadingStyle, errorStyle } = useCard({
    glow,
    shine,
    isLoading,
    isError,
  });

  return (
    <Box
      position='relative'
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      {isLoading && <Box sx={loadingStyle} />}
      <ChakraCard
        sx={{
          ...glowStyle,
          ...shineStyle,
          ...errorStyle,
          _hover: { boxShadow: onClick ? 'md' : 'sm' },
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <Box position='relative' zIndex={1}>
          {title && (
            <CardHeader {...cardHeaderProps}>
              {title}
              {icon && <Icon as={icon} />}
            </CardHeader>
          )}
          <CardBody {...cardBodyProps}>{children}</CardBody>
          {footer && <CardFooter {...cardFooterProps}>{footer}</CardFooter>}
        </Box>
      </ChakraCard>
    </Box>
  );
}
