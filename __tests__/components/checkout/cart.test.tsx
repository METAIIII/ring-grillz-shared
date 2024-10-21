import { useRouter } from 'next/router';
import { ChakraProvider } from '@chakra-ui/react';
import { screen } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import '@testing-library/jest-dom';

import Cart, { CartProps } from '../../../components/checkout/cart';
import { formatCouponDiscount } from '../../../utils/get-totals';
import { formatAmountForDisplay } from '../../../utils/stripe-helpers';
import {
  getMockCartTotal,
  MOCK_CART_ITEM_AMOUNT,
  MOCK_COUPON_AMOUNT_OFF,
  MOCK_COUPON_CODE,
  mockCartItem,
  mockCoupon,
  mockLineItem,
  mockPromotion,
} from '../../../utils/test-utils/mock-data';
import { renderWithProviders } from '../../../utils/test-utils/redux';

// Enable fetch mocking
fetchMock.enableMocks();

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Cart', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    // Mock the useRouter implementation for each test
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: {},
    }));
  });

  const cartItems = [mockCartItem()];

  const mockProps: CartProps = {
    cartItems,
    cartItemComponent: jest.fn(() => <div>Mock Cart Item</div>),
    cartTotal: getMockCartTotal(cartItems),
    coupon: null,
    couponCode: '',
    lineItems: [mockLineItem()],
    orderType: 'GRILLZ',
  };

  it('renders cart items and total correctly', () => {
    renderWithProviders(
      <ChakraProvider>
        <Cart {...mockProps} />
      </ChakraProvider>,
    );

    expect(screen.getByText('Your Cart (1)')).toBeInTheDocument();
    expect(screen.getByText(formatAmountForDisplay(MOCK_CART_ITEM_AMOUNT))).toBeInTheDocument();
    expect(screen.getByText('Mock Cart Item')).toBeInTheDocument();
  });

  it('displays coupon discount when applied', () => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: { coupon: MOCK_COUPON_CODE },
    }));
    const propsWithCoupon: CartProps = {
      ...mockProps,
      couponCode: MOCK_COUPON_CODE,
      coupon: {
        ...mockCoupon(),
        promotion: mockPromotion(),
      },
    };

    renderWithProviders(
      <ChakraProvider>
        <Cart {...propsWithCoupon} />
      </ChakraProvider>,
    );

    expect(
      screen.getByText(formatAmountForDisplay(MOCK_CART_ITEM_AMOUNT - MOCK_COUPON_AMOUNT_OFF)),
    ).toBeInTheDocument();
    expect(screen.getByText(formatCouponDiscount(MOCK_COUPON_AMOUNT_OFF))).toBeInTheDocument();
  });
});
