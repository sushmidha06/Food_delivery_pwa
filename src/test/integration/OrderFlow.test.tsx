import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../../contexts/CartContext';
import { PaymentSelector } from '../../components/checkout/PaymentSelector';
import { MenuItem, Restaurant } from '../../types';

const mockRestaurant: Restaurant = {
  id: 'rest-e2e',
  name: 'Spice Symphony',
  description: 'Authentic Indian Cuisine',
  image_url: 'https://images.unsplash.com/spice',
  cuisine: 'Indian',
  rating: 4.9,
  delivery_time: '20-30 min',
  delivery_fee: 30,
  is_open: true,
  address: '100 MG Road, Bengaluru',
};

const mockItem: MenuItem = {
  id: 'dish-1',
  restaurant_id: 'rest-e2e',
  name: 'Paneer Butter Masala',
  description: 'Rich tomato cashew gravy',
  price: 280,
  image_url: 'https://images.unsplash.com/paneer',
  is_available: true,
  is_vegetarian: true,
};

// Simulation Component representing an order checkout flow
const CheckoutFlowDemo: React.FC = () => {
  const { items, restaurant, addItem, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = React.useState('Demo Instant Pay (UPI / Card)');
  const [orderPlaced, setOrderPlaced] = React.useState(false);

  return (
    <div>
      <h1>Zestora Fast Checkout</h1>
      <button
        data-testid="add-dish-btn"
        onClick={() => addItem(mockItem, mockRestaurant)}
      >
        Add Dish
      </button>

      {items.length > 0 && (
        <div data-testid="order-summary">
          <div>Ordering from: {restaurant?.name}</div>
          <div data-testid="cart-count">Items: {items.length}</div>
          <div data-testid="total-amount">Total: ₹{total}</div>

          <PaymentSelector
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
          />

          <button
            data-testid="place-order-btn"
            onClick={() => {
              setOrderPlaced(true);
              clearCart();
            }}
          >
            Confirm & Place Order
          </button>
        </div>
      )}

      {orderPlaced && (
        <div data-testid="order-success-banner">
          Order placed successfully with {paymentMethod}!
        </div>
      )}
    </div>
  );
};

describe('Order Flow Integration Journey', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('completes the full flow: adding item -> viewing summary -> selecting payment -> placing order', async () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <CheckoutFlowDemo />
        </CartProvider>
      </MemoryRouter>
    );

    // Initial state: No items in cart
    expect(screen.queryByTestId('order-summary')).not.toBeInTheDocument();

    // Step 1: Add dish to cart
    fireEvent.click(screen.getByTestId('add-dish-btn'));

    // Step 2: Verify order summary is shown with correct calculations
    expect(screen.getByTestId('order-summary')).toBeInTheDocument();
    expect(screen.getByText('Ordering from: Spice Symphony')).toBeInTheDocument();
    expect(screen.getByTestId('cart-count')).toHaveTextContent('Items: 1');

    // Total = subtotal (280) + delivery (30) + 5% tax (14) = 324
    expect(screen.getByTestId('total-amount')).toHaveTextContent('Total: ₹324');

    // Step 3: Switch payment method
    fireEvent.click(screen.getByText('Cash on Delivery'));

    // Step 4: Place order
    fireEvent.click(screen.getByTestId('place-order-btn'));

    // Step 5: Verify confirmation and cart reset
    await waitFor(() => {
      expect(screen.getByTestId('order-success-banner')).toHaveTextContent(
        'Order placed successfully with Cash on Delivery!'
      );
    });

    expect(screen.queryByTestId('order-summary')).not.toBeInTheDocument();
  });
});
