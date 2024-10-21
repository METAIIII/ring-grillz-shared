import { act, renderHook } from '@testing-library/react';

import { CheckoutProps, useCheckout } from '../../../components/checkout/use-checkout';
import { useCreateCheckoutSessionMutation, useCreateOrderMutation } from '../../../reducers/api';

// Mock the API hooks
jest.mock('@shared/reducers/api', () => ({
  useCreateOrderMutation: jest.fn(),
  useCreateCheckoutSessionMutation: jest.fn(),
}));

describe('useCheckout', () => {
  const mockProps: CheckoutProps = {
    lineItems: [{ price: 'price_123', quantity: 1 }],
    couponCode: 'DISCOUNT10',
    orderType: 'GRILLZ',
  };

  beforeEach(() => {
    (useCreateOrderMutation as jest.Mock).mockReturnValue([jest.fn(), { isLoading: false }]);
    (useCreateCheckoutSessionMutation as jest.Mock).mockReturnValue([jest.fn(), {}]);
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useCheckout(mockProps));

    act(() => {
      expect(result.current.errors).toEqual({});
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  it('should handle form submission correctly', async () => {
    const mockCreateOrder = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ data: { id: 'order_123' } }),
    });

    const mockCreateCheckoutSession = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ data: { sessionUrl: 'https://checkout.stripe.com' } }),
    });

    (useCreateOrderMutation as jest.Mock).mockReturnValue([mockCreateOrder, { isLoading: false }]);
    (useCreateCheckoutSessionMutation as jest.Mock).mockReturnValue([
      mockCreateCheckoutSession,
      {},
    ]);

    const { result } = renderHook(() => useCheckout(mockProps));

    await act(async () => {
      await result.current.onSubmit({ email: 'test@example.com', notes: 'Test note' });
    });

    expect(mockCreateOrder).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'test@example.com',
        customerNotes: 'Test note',
        couponCode: 'DISCOUNT10',
        type: 'GRILLZ',
        items: mockProps.lineItems,
        paymentType: 'FULL_PAYMENT',
        status: 'UNPAID',
      }),
    });

    expect(mockCreateOrder().unwrap).toHaveBeenCalled();
    expect(mockCreateCheckoutSession().unwrap).toHaveBeenCalled();
    expect(mockCreateCheckoutSession).toHaveBeenCalledWith({ orderId: 'order_123' });
  });
});
