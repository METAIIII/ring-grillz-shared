import { useEffect, useRef, useState } from 'react';
import {
  Box,
  BoxProps,
  CardBody,
  CardBodyProps,
  CardFooter,
  CardFooterProps,
  CardHeader,
  CardHeaderProps,
  Card as ChakraCard,
  Icon,
  SystemStyleObject,
  useColorModeValue,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { IconType } from 'react-icons';

const rotateAnimation = keyframes`  
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }   
`;

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
}: {
  children: React.ReactNode;
  title?: string;
  icon?: IconType;
  footer?: React.ReactNode;
  glow?: boolean;
  shine?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  cardBodyProps?: CardBodyProps;
  cardFooterProps?: CardFooterProps;
  cardHeaderProps?: CardHeaderProps;
} & BoxProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const shineColor = useColorModeValue('rgba(215, 219, 224, 0.25)', 'rgba(45, 51, 57, 0.5)');

  useEffect(() => {
    if (!shine) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [shine, isHovered]);

  const glowStyle: SystemStyleObject = glow
    ? {
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-1px',
          left: '-1px',
          right: '-1px',
          bottom: '-1px',
          background: `
            radial-gradient(circle at 0% 0%, rgba(255, 193, 93, 0.5) 0%, rgba(255, 193, 93, 0) 50%),
            radial-gradient(circle at 100% 100%, rgba(255, 193, 93, 0.5) 0%, rgba(255, 193, 93, 0) 50%)
          `,
          filter: 'blur(20px)',
          opacity: isHovered ? 0.8 : 0.5,
          transition: 'opacity 0.3s ease-in-out',
          borderRadius: 'inherit',
          zIndex: -1,
        },
      }
    : {};

  const shineStyle: SystemStyleObject = shine
    ? {
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          background: `radial-gradient(circle 700px at ${mousePosition.x}px ${mousePosition.y}px, ${shineColor}, transparent 50%)`,
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          zIndex: 0,
        },
      }
    : {};

  const loadingStyle: SystemStyleObject = isLoading
    ? {
        position: 'absolute',
        top: '-1px',
        left: '-1px',
        right: '-1px',
        bottom: '-1px',
        overflow: 'hidden',
        borderRadius: 12,
        zIndex: 0,
        '&::before': {
          content: '""',
          backgroundImage: 'conic-gradient(#ffc15d 20deg, transparent 120deg)',
          height: '200%',
          width: '200%',
          position: 'absolute',
          left: '-50%',
          top: '-50%',
          animation: `${rotateAnimation} 1.8s infinite linear`,
        },
      }
    : {};

  const errorStyle: SystemStyleObject = isError ? { borderColor: 'red !important' } : {};

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
