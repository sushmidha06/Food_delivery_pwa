import { describe, it, expect, beforeEach } from 'vitest';
import { profileService } from '../profileService';

describe('profileService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates and returns a fallback profile when no profile exists', async () => {
    const profile = await profileService.getProfile('user-456', 'Priya Sharma', 'priya@example.com');
    expect(profile.id).toBe('user-456');
    expect(profile.full_name).toBe('Priya Sharma');
    expect(profile.email).toBe('priya@example.com');
  });

  it('updates profile and persists the changes', async () => {
    await profileService.getProfile('user-456', 'Priya Sharma', 'priya@example.com');
    const updated = await profileService.updateProfile('user-456', {
      phone: '+91 9876543210',
      full_name: 'Priya S.',
    });

    expect(updated.full_name).toBe('Priya S.');
    expect(updated.phone).toBe('+91 9876543210');

    // Fetch again to verify persistence
    const fetched = await profileService.getProfile('user-456');
    expect(fetched.full_name).toBe('Priya S.');
    expect(fetched.phone).toBe('+91 9876543210');
  });
});
