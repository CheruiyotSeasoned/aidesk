import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, ApiError, tokenStore } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  experience?: string | null;
  hourly_rate?: number | null;
  skills: string[];
  availability: {
    hours_per_week: number;
    timezone: string;
    preferred_schedule: string;
  };
  payment_details: {
    method: 'paypal' | 'bank_transfer';
    paypal_email?: string | null;
    bank_account_name?: string | null;
    /** Masked by the API - last 4 digits only. */
    bank_account_number?: string | null;
  };
  onboardingCompleted: boolean;
  onboardingProgress: {
    personalInfo: boolean;
    skills: boolean;
    availability: boolean;
    payment: boolean;
    review: boolean;
  };
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'under_review';
  approvalNotes?: string;
}

export interface OnboardingPayload {
  name?: string;
  phone?: string;
  location?: string;
  bio?: string;
  experience?: string | null;
  hourly_rate?: number | null;
  skills?: string[];
  availability?: Partial<User['availability']>;
  payment_details?: Record<string, unknown>;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
  updateOnboardingProgress: (step: keyof User['onboardingProgress']) => Promise<void>;
  completeOnboarding: (data?: OnboardingPayload) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const CACHE_KEY = 'user';

const cacheUser = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CACHE_KEY);
    }
  } catch {
    /* storage unavailable - the app still works, it just won't restore on reload */
  }
};

const readCachedUser = (): User | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const applyUser = (nextUser: User | null) => {
    setUser(nextUser);
    cacheUser(nextUser);
  };

  // Restore from cache for an instant render, then confirm against the API.
  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      if (!tokenStore.get()) {
        applyUser(null);
        setLoading(false);
        return;
      }

      const cached = readCachedUser();
      if (cached) setUser(cached);

      try {
        const { user: fresh } = await api.get<{ user: User }>('/auth/me');
        if (!cancelled) applyUser(fresh);
      } catch (error) {
        // 401 means the token is dead; anything else (server down) shouldn't
        // wipe a cached session the user may still be able to use shortly.
        if (!cancelled && error instanceof ApiError && error.status === 401) {
          tokenStore.clear();
          applyUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    restore();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user: authed } = await api.post<{ token: string; user: User }>(
      '/auth/login',
      { email, password },
      { auth: false },
    );
    tokenStore.set(token);
    applyUser(authed);
  };

  const signup = async (email: string, password: string) => {
    const { token, user: created } = await api.post<{ token: string; user: User }>(
      '/auth/register',
      { email, password, password_confirmation: password },
      { auth: false },
    );
    tokenStore.set(token);
    applyUser(created);

    // The Laravel API signs new users in immediately - there is no email
    // confirmation gate. Kept in the return shape so callers stay unchanged.
    return { needsEmailConfirmation: false };
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Even if revoking server-side fails, drop the local session.
    } finally {
      tokenStore.clear();
      applyUser(null);
    }
  };

  const updateOnboardingProgress = async (step: keyof User['onboardingProgress']) => {
    const { user: updated } = await api.post<{ user: User }>('/profile/onboarding/step', {
      step,
    });
    applyUser(updated);
  };

  const completeOnboarding = async (data?: OnboardingPayload) => {
    const { user: updated } = await api.post<{ user: User }>(
      '/profile/onboarding/complete',
      data ?? {},
    );
    applyUser(updated);
  };

  const refreshUserProfile = async () => {
    const { user: fresh } = await api.get<{ user: User }>('/auth/me');
    applyUser(fresh);
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateOnboardingProgress,
    completeOnboarding,
    refreshUserProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
