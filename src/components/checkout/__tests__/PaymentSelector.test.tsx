import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentSelector } from '../PaymentSelector';

describe('PaymentSelector component', () => {
  it('renders payment method options correctly', () => {
    const handleSelect = vi.fn();
    render(
      <PaymentSelector
        selectedMethod="Demo Instant Pay (UPI / Card)"
        onSelectMethod={handleSelect}
      />
    );

    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    expect(screen.getByText('Demo Instant Pay (UPI / Card)')).toBeInTheDocument();
    expect(screen.getByText('Cash on Delivery')).toBeInTheDocument();
  });

  it('triggers onSelectMethod when a payment option is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <PaymentSelector
        selectedMethod="Demo Instant Pay (UPI / Card)"
        onSelectMethod={handleSelect}
      />
    );

    const codOption = screen.getByText('Cash on Delivery');
    fireEvent.click(codOption);

    expect(handleSelect).toHaveBeenCalledWith('Cash on Delivery');
  });

  it('highlights the currently selected method', () => {
    const { rerender } = render(
      <PaymentSelector
        selectedMethod="Demo Instant Pay (UPI / Card)"
        onSelectMethod={vi.fn()}
      />
    );

    const instantOption = screen.getByText('Demo Instant Pay (UPI / Card)').closest('label');
    expect(instantOption).toHaveClass('border-brand-500');

    rerender(
      <PaymentSelector
        selectedMethod="Cash on Delivery"
        onSelectMethod={vi.fn()}
      />
    );

    const codOption = screen.getByText('Cash on Delivery').closest('label');
    expect(codOption).toHaveClass('border-brand-500');
  });
});
