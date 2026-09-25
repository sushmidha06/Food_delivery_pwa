import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('throws error when useAuth is used without AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider'
    );
  });

  it('validates signup input parameters', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let res = await result.current.signUp('invalid-email', '123456', 'Name');
    expect(res.error?.message).toContain('valid email');

    res = await result.current.signUp('valid@example.com', '123', 'Name');
    expect(res.error?.message).toContain('at least 6 characters');

    res = await result.current.signUp('valid@example.com', '123456', '   ');
    expect(res.error?.message).toContain('full name');
  });

  it('registers a new user and logs them in', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const res = await result.current.signUp('alice@test.com', 'secret123', 'Alice Wonderland');
      expect(res.error).toBeNull();
    });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toBe('alice@test.com');
    expect(result.current.user?.full_name).toBe('Alice Wonderland');
  });

  it('signs in an existing user with correct credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signUp('bob@test.com', 'password123', 'Bob Builder');
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();

    await act(async () => {
      const res = await result.current.signIn('bob@test.com', 'password123');
      expect(res.error).toBeNull();
    });

    expect(result.current.user?.email).toBe('bob@test.com');
    expect(result.current.user?.full_name).toBe('Bob Builder');
  });

  it('rejects sign in with incorrect password', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signUp('charlie@test.com', 'pass123', 'Charlie Chaplin');
      await result.current.signOut();
    });

    await act(async () => {
      const res = await result.current.signIn('charlie@test.com', 'wrongpass');
      expect(res.error?.message).toContain('Incorrect password');
    });

    expect(result.current.user).toBeNull();
  });

  it('supports demo guest login and sign out', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.signInAsDemo();
    });

    expect(result.current.user?.id).toBe('demo-guest-user');
    expect(result.current.user?.email).toBe('guest@zestora.com');

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('zestora_active_user')).toBeNull();
  });
});
