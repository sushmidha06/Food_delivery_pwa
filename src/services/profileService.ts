import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types';

export const profileService = {
  async getProfile(userId: string, defaultName?: string, defaultEmail?: string): Promise<Profile> {
    if (isSupabaseConfigured && userId && !userId.startsWith('local-')) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase profile fetch error:', err);
      }
    }

    // Local profile lookup by userId
    try {
      const raw = localStorage.getItem(`zestora_profile_${userId}`);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading local profile:', e);
    }

    // Fallback: create fresh profile for this user
    const freshProfile: Profile = {
      id: userId,
      full_name: defaultName || 'Food Lover',
      email: defaultEmail || '',
      phone: '',
      avatar_url: '',
      created_at: new Date().toISOString(),
    };
    try {
      localStorage.setItem(`zestora_profile_${userId}`, JSON.stringify(freshProfile));
    } catch (e) {
      console.error(e);
    }
    return freshProfile;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    if (isSupabaseConfigured && userId && !userId.startsWith('local-')) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateProfile error:', err);
      }
    }

    // Local update
    let current: Profile = {
      id: userId,
      full_name: updates.full_name || 'Food Lover',
      email: updates.email || '',
      phone: updates.phone || '',
      avatar_url: updates.avatar_url || '',
      created_at: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem(`zestora_profile_${userId}`);
      if (raw) {
        current = { ...JSON.parse(raw), ...updates, updated_at: new Date().toISOString() };
      } else {
        current = { ...current, ...updates, updated_at: new Date().toISOString() };
      }
      localStorage.setItem(`zestora_profile_${userId}`, JSON.stringify(current));
    } catch (e) {
      console.error(e);
    }

    return current;
  }
};
