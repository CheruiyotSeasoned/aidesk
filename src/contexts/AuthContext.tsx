import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfileService } from '@/services/userProfileService';
import { UserProfile } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { OnboardingData } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills: string[];
  availability: {
    hours_per_week: number;
    timezone: string;
    preferred_schedule: string;
  };
  payment_details: {
    method: 'paypal' | 'bank_transfer';
    paypal_email?: string;
    bank_account_name?: string;
    bank_account_number?: string;
    bank_routing_number?: string;
    card_holder_name?: string;
    card_number?: string;
    card_expiry?: string;
    card_cvv?: string;
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

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  updateOnboardingProgress: (step: keyof User['onboardingProgress']) => Promise<void>;
  completeOnboarding: (onboardingData?: Partial<User>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  // 🧱 Convert Supabase profile to internal User format
  const convertProfileToUser = (profile: UserProfile): User => ({
    id: profile.user_id,
    email: profile.email,
    name: profile.name,
    avatar: profile.avatar,
    phone: profile.phone,
    location: profile.location,
    bio: profile.bio,
    skills: profile.skills || [],
    availability: profile.availability || { hours_per_week: 0, timezone: '', preferred_schedule: '' },
    payment_details: profile.payment_details || { method: 'paypal' },
    onboardingCompleted: profile.onboarding_completed,
    onboardingProgress: {
      personalInfo: profile.onboarding_progress?.personal_info || false,
      skills: profile.onboarding_progress?.skills || false,
      availability: profile.onboarding_progress?.availability || false,
      payment: profile.onboarding_progress?.payment || false,
      review: profile.onboarding_progress?.review || false,
    },
    approvalStatus: profile.approval_status,
    approvalNotes: profile.approval_notes,
  });

  // 🧱 Create a basic user structure from Supabase user
  const createBasicUserData = (supabaseUser: SupabaseUser): User => ({
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      supabaseUser.email?.split('@')[0] ||
      'User',
    avatar: supabaseUser.user_metadata?.avatar_url ||
      supabaseUser.user_metadata?.picture ||
      undefined,
    skills: [],
    availability: { hours_per_week: 0, timezone: '', preferred_schedule: '' },
    payment_details: { method: 'paypal' },
    onboardingCompleted: false,
    onboardingProgress: {
      personalInfo: false,
      skills: false,
      availability: false,
      payment: false,
      review: false,
    },
    approvalStatus: 'pending',
  });

  // 🧱 Create user profile in Supabase if not found
  const createUserProfile = async (supabaseUser: SupabaseUser): Promise<User> => {
    const profileData = {
      user_id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name ||
        supabaseUser.user_metadata?.name ||
        supabaseUser.email?.split('@')[0] ||
        'User',
      avatar: supabaseUser.user_metadata?.avatar_url ||
        supabaseUser.user_metadata?.picture,
      phone: undefined,
      location: undefined,
      bio: undefined,
      skills: [] as string[],
      availability: {
        hours_per_week: 0,
        timezone: '',
        preferred_schedule: ''
      },
      payment_details: {
        method: 'paypal' as const
      },
      onboarding_completed: false,
      onboarding_progress: {
        personal_info: false,
        skills: false,
        availability: false,
        payment: false,
        review: false,
      },
      approval_status: 'pending' as const,
      approval_notes: undefined,
    };

    try {
      const newProfile = await UserProfileService.upsertProfile(profileData);
      return convertProfileToUser(newProfile);
    } catch (error) {
      console.error('Profile creation failed, fallback to basic user:', error);
      return createBasicUserData(supabaseUser);
    }
  };

  // 💾 Sync user data to localStorage
  const syncUserToStorage = (userData: User | null) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };

  // 🧠 Listen to Supabase auth changes
 useEffect(() => {
  let isMounted = true;

  const initAuth = async () => {
    // Restore user from localStorage immediately
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser);
        setUser(parsedUser);
        // ✅ Prevent dashboard from staying in loading state forever
        setLoading(false);
      } catch {
        localStorage.removeItem('user');
        setLoading(false);
      }
    } else {
      // ✅ If no cached user, stop loading
      setLoading(false);
    }

    // Then verify Supabase session silently in the background
    const { data: { session } } = await supabase.auth.getSession();
    if (isMounted && session?.user) {
      loadUserProfile(session.user);
    }

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  };

  initAuth();
}, []);


  // 🔄 Load user profile from Supabase
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      let profile = await UserProfileService.getProfile(supabaseUser.id);

      if (!isMountedRef.current) return;

      if (!profile) {
        const userData = await createUserProfile(supabaseUser);
        setUser(userData);
        syncUserToStorage(userData);
      } else {
        const userData = convertProfileToUser(profile);
        setUser(userData);
        syncUserToStorage(userData);
      }
    } catch (error: any) {
      if (!isMountedRef.current) return;

      if (error?.code === 'PGRST116') {
        const userData = await createUserProfile(supabaseUser);
        setUser(userData);
        syncUserToStorage(userData);
      } else {
        console.error('Auth profile sync error:', error);
        const fallback = createBasicUserData(supabaseUser);
        setUser(fallback);
        syncUserToStorage(fallback);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // ✨ Auth Methods
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Auth state change listener will handle loading state
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      // Auth state change listener will handle loading state
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      // OAuth redirect happens, no need to manage loading
    } catch (error) {
      throw error;
    }
  };

  const loginWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      // OAuth redirect happens, no need to manage loading
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      syncUserToStorage(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // 🧭 Onboarding updates
  const updateOnboardingProgress = async (step: keyof User['onboardingProgress']) => {
    if (!user) return;

    const previousUser = { ...user };
    const updatedProgress = { ...user.onboardingProgress, [step]: true };
    const optimisticUser = {
      ...user,
      onboardingProgress: updatedProgress,
    };

    // Optimistic update
    setUser(optimisticUser);
    syncUserToStorage(optimisticUser);

    const supabaseStep = step === 'personalInfo' ? 'personal_info' : step;

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      let profile = await UserProfileService.getProfile(user.id).catch(() => null);
      if (!profile && currentUser) {
        await createUserProfile(currentUser);
      }

      await UserProfileService.updateOnboardingProgress(user.id, { [supabaseStep]: true });
    } catch (error) {
      console.error('Onboarding progress update failed:', error);
      // Revert on error
      setUser(previousUser);
      syncUserToStorage(previousUser);
      throw error;
    }
  };

  const completeOnboarding = async (onboardingData?: Partial<User>) => {
    if (!user) return;

    const previousUser = { ...user };

    try {
      const profile = await UserProfileService.getProfile(user.id);

      if (profile) {
        // Build complete OnboardingData with required fields
        const onboardingUpdate: OnboardingData = {
          name: onboardingData?.name || profile.name,
          email: onboardingData?.email || profile.email,
          phone: onboardingData?.phone || profile.phone,
          location: onboardingData?.location || profile.location,
          bio: onboardingData?.bio || profile.bio,
          skills: onboardingData?.skills || profile.skills,
          availability: onboardingData?.availability || profile.availability,
          payment_details: onboardingData?.payment_details || profile.payment_details,
        };

        await UserProfileService.completeOnboarding(user.id, onboardingUpdate);
      } else {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          await UserProfileService.upsertProfile({
            user_id: currentUser.id,
            email: onboardingData?.email || currentUser.email || '',
            name: onboardingData?.name || currentUser.user_metadata?.full_name || 'User',
            avatar: onboardingData?.avatar || currentUser.user_metadata?.avatar_url,
            phone: onboardingData?.phone,
            location: onboardingData?.location,
            bio: onboardingData?.bio,
            skills: onboardingData?.skills || [],
            availability: onboardingData?.availability || {
              hours_per_week: 0,
              timezone: '',
              preferred_schedule: ''
            },
            payment_details: onboardingData?.payment_details || {
              method: 'paypal' as const
            },
            onboarding_completed: true,
            onboarding_progress: {
              personal_info: true,
              skills: true,
              availability: true,
              payment: true,
              review: true,
            },
            approval_status: 'pending' as const,
            approval_notes: undefined,
          });
        }
      }

      // Update state after successful DB operation
      const updatedUser = { ...user, onboardingCompleted: true };
      setUser(updatedUser);
      syncUserToStorage(updatedUser);
    } catch (error) {
      console.error('Complete onboarding error:', error);
      // Revert on error
      setUser(previousUser);
      syncUserToStorage(previousUser);
      throw error;
    }
  };

  const refreshUserProfile = async () => {
    if (!user) return;
    try {
      const profile = await UserProfileService.getProfile(user.id);
      if (profile) {
        const userData = convertProfileToUser(profile);
        setUser(userData);
        syncUserToStorage(userData);
      }
    } catch (error: any) {
      if (error?.code === 'PGRST116') {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          const newUser = await createUserProfile(currentUser);
          setUser(newUser);
          syncUserToStorage(newUser);
        }
      } else {
        console.error('Profile refresh failed:', error);
        throw error;
      }
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    loginWithGoogle,
    loginWithGitHub,
    logout,
    updateOnboardingProgress,
    completeOnboarding,
    refreshUserProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};