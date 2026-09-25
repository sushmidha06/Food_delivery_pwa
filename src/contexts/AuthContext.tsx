import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { profileService } from '../services/profileService';
import { User, Profile } from '../types';

interface GoogleAuthPayload {
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isDemoUser: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: (googleData?: GoogleAuthPayload) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signInAsDemo: () => void;
  refreshProfile: () => Promise<void>;
  updateUserMetadata: (updates: { full_name?: string; phone?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USERS_KEY = 'zestora_registered_users';
const ACTIVE_USER_KEY = 'zestora_active_user';

interface RegisteredLocalUser {
  id: string;
  email: string;
  password?: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  provider?: 'email' | 'google';
}

function getStoredUsers(): RegisteredLocalUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: RegisteredLocalUser[]) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error(e);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);

  useEffect(() => {
    // 1. First check if a real local active user is saved
    const savedActive = localStorage.getItem(ACTIVE_USER_KEY);
    if (savedActive) {
      try {
        const parsed = JSON.parse(savedActive);
        setUser(parsed);
        setIsDemoUser(false);
        profileService.getProfile(parsed.id, parsed.full_name, parsed.email).then(setProfile);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Failed to parse active user:', e);
      }
    }

    // 2. Check Supabase session if configured
    if (isSupabaseConfigured) {
      const initSession = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const u: User = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
              phone: session.user.user_metadata?.phone,
              avatar_url: session.user.user_metadata?.avatar_url,
            };
            setUser(u);
            setIsDemoUser(false);
            const prof = await profileService.getProfile(session.user.id, u.full_name, u.email);
            setProfile(prof);
          }
        } catch (err) {
          console.warn('Session init error:', err);
        } finally {
          setLoading(false);
        }
      };

      initSession();

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const u: User = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
            phone: session.user.user_metadata?.phone,
            avatar_url: session.user.user_metadata?.avatar_url,
          };
          setUser(u);
          setIsDemoUser(false);
          const prof = await profileService.getProfile(session.user.id, u.full_name, u.email);
          setProfile(prof);
        } else if (!localStorage.getItem(ACTIVE_USER_KEY)) {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Supabase not configured and no saved user: user is guest (logged out)
      setUser(null);
      setProfile(null);
      setIsDemoUser(false);
      setLoading(false);
    }
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const updated = await profileService.getProfile(user.id, user.full_name, user.email);
      setProfile(updated);
    }
  };

  const updateUserMetadata = async (updates: { full_name?: string; phone?: string; avatar_url?: string }) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      ...updates,
    };
    setUser(updatedUser);
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(updatedUser));

    // Update in stored registered users list
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      saveStoredUsers(users);
    }

    const updatedProfile = await profileService.updateProfile(user.id, updates);
    setProfile(updatedProfile);
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!error && data.user) {
          const u: User = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
          };
          setUser(u);
          setIsDemoUser(false);
          localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(u));
          const prof = await profileService.getProfile(u.id, u.full_name, u.email);
          setProfile(prof);
          return { error: null };
        }
      } catch (err) {
        console.warn('Supabase sign in failed, checking local users:', err);
      }
    }

    // 2. Check locally registered users
    const users = getStoredUsers();
    const match = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (match) {
      if (match.password && match.password !== password) {
        return { error: new Error('Incorrect password. Please try again.') };
      }

      const activeUser: User = {
        id: match.id,
        email: match.email,
        full_name: match.full_name,
        phone: match.phone,
        avatar_url: match.avatar_url,
      };

      setUser(activeUser);
      setIsDemoUser(false);
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(activeUser));
      const prof = await profileService.getProfile(activeUser.id, activeUser.full_name, activeUser.email);
      setProfile(prof);
      return { error: null };
    }

    return {
      error: new Error('Account not found with this email. Please click "Sign Up" to create an account.'),
    };
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error: Error | null }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanName) {
      return { error: new Error('Please enter your full name.') };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { error: new Error('Please enter a valid email address.') };
    }
    if (password.length < 6) {
      return { error: new Error('Password must be at least 6 characters.') };
    }

    let createdId = `user-${Date.now()}`;

    // 1. Try Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: cleanName },
          },
        });

        if (error) {
          console.warn('Supabase signup error:', error.message);
        } else if (data.user) {
          createdId = data.user.id;
        }
      } catch (err) {
        console.warn('Supabase signup error:', err);
      }
    }

    // 2. Save locally so it always works immediately
    const users = getStoredUsers();
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    const newRecord: RegisteredLocalUser = {
      id: createdId,
      email: cleanEmail,
      password,
      full_name: cleanName,
      provider: 'email',
    };

    if (existingIndex >= 0) {
      users[existingIndex] = newRecord;
    } else {
      users.push(newRecord);
    }
    saveStoredUsers(users);

    const activeUser: User = {
      id: createdId,
      email: cleanEmail,
      full_name: cleanName,
    };

    setUser(activeUser);
    setIsDemoUser(false);
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(activeUser));

    // Save profile with their real name
    const prof = await profileService.updateProfile(createdId, {
      full_name: cleanName,
      email: cleanEmail,
    });
    setProfile(prof);

    return { error: null };
  };

  const signInWithGoogle = async (googleData?: GoogleAuthPayload): Promise<{ error: Error | null }> => {
    // If Supabase is configured and no manual payload provided, trigger OAuth redirect
    if (isSupabaseConfigured && !googleData) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        return { error: null };
      } catch (err: any) {
        console.warn('Supabase Google OAuth failed, continuing with direct Google Sign In:', err);
      }
    }

    // Direct Google Sign In with user details (e.g. from Google Dialog or prompt)
    if (googleData) {
      const cleanEmail = googleData.email.trim().toLowerCase();
      const cleanName = googleData.name.trim() || cleanEmail.split('@')[0];
      const googleId = `google-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

      const users = getStoredUsers();
      const existingIdx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
      const googleRecord: RegisteredLocalUser = {
        id: googleId,
        email: cleanEmail,
        full_name: cleanName,
        avatar_url: googleData.avatar || '',
        provider: 'google',
      };

      if (existingIdx >= 0) {
        users[existingIdx] = { ...users[existingIdx], ...googleRecord };
      } else {
        users.push(googleRecord);
      }
      saveStoredUsers(users);

      const activeUser: User = {
        id: googleId,
        email: cleanEmail,
        full_name: cleanName,
        avatar_url: googleData.avatar,
      };

      setUser(activeUser);
      setIsDemoUser(false);
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(activeUser));

      const prof = await profileService.updateProfile(googleId, {
        full_name: cleanName,
        email: cleanEmail,
        avatar_url: googleData.avatar || '',
      });
      setProfile(prof);

      return { error: null };
    }

    return { error: new Error('No Google credentials provided.') };
  };

  const signOut = async () => {
    localStorage.removeItem(ACTIVE_USER_KEY);
    localStorage.removeItem('zestora_is_demo_user');
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
    setUser(null);
    setProfile(null);
    setIsDemoUser(false);
  };

  const signInAsDemo = () => {
    // Keep function signature for backward-compatibility if invoked
    const demoUser: User = {
      id: 'demo-guest-user',
      email: 'guest@zestora.com',
      full_name: 'Guest Diner',
    };
    setUser(demoUser);
    setIsDemoUser(false);
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(demoUser));
    profileService.getProfile(demoUser.id, demoUser.full_name, demoUser.email).then(setProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isDemoUser,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        signInAsDemo,
        refreshProfile,
        updateUserMetadata,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
