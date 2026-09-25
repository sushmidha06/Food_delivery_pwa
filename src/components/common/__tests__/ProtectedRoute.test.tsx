import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import * as useAuthHook from '../../../hooks/useAuth';

vi.mock('../../../hooks/useAuth');

const mockAuthBase = {
  user: null,
  profile: null,
  loading: false,
  isDemoUser: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  signInAsDemo: vi.fn(),
  refreshProfile: vi.fn(),
  updateUserMetadata: vi.fn(),
};

describe('ProtectedRoute component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading spinner when auth state is loading', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      ...mockAuthBase,
      loading: true,
    });

    const { container } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('redirects to /login when user is unauthenticated', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      ...mockAuthBase,
      loading: false,
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <Routes>
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <div>Checkout Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page Screen</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Checkout Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page Screen')).toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      ...mockAuthBase,
      user: { id: 'u123', email: 'test@example.com' },
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute>
          <div>Protected Member Area</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Member Area')).toBeInTheDocument();
  });
});
