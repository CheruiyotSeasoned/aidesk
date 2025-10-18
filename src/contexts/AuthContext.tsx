import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { UserProfileService } from '@/services/userProfileService';
import { UserProfile } from '@/lib/supabase';

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
  logout: () => void;
  updateOnboardingProgress: (step: keyof User['onboardingProgress']) => Promise<void>;
  completeOnboarding: (onboardingData?: any) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in - try to get profile from Supabase first
        try {
          const profile = await UserProfileService.getProfile(firebaseUser.uid);
          if (profile) {
            // Convert Supabase profile to User format
            const userData: User = {
              id: profile.user_id,
              email: profile.email,
              name: profile.name,
              avatar: profile.avatar,
              phone: profile.phone,
              location: profile.location,
              bio: profile.bio,
              skills: profile.skills || [],
              availability: profile.availability || {
                hours_per_week: 0,
                timezone: '',
                preferred_schedule: ''
              },
              payment_details: profile.payment_details || {
                method: 'paypal'
              },
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
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            // No profile found, create a basic user object
            const userData: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              avatar: firebaseUser.photoURL || undefined,
              skills: [],
              availability: {
                hours_per_week: 0,
                timezone: '',
                preferred_schedule: ''
              },
              payment_details: {
                method: 'paypal'
              },
              onboardingCompleted: false,
              onboardingProgress: {
                personalInfo: false,
                skills: false,
                availability: false,
                payment: false,
                review: false,
              },
              approvalStatus: 'pending',
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to basic user data
          const userData: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            avatar: firebaseUser.photoURL || undefined,
            skills: [],
            availability: {
              hours_per_week: 0,
              timezone: '',
              preferred_schedule: ''
            },
            payment_details: {
              method: 'paypal'
            },
            onboardingCompleted: false,
            onboardingProgress: {
              personalInfo: false,
              skills: false,
              availability: false,
              payment: false,
              review: false,
            },
            approvalStatus: 'pending',
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        // User is signed out
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle updating the user state
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle updating the user state
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle updating the user state
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGitHub = async () => {
    setLoading(true);
    // Mock GitHub login
    const mockUser: User = {
      id: '1',
      email: 'user@github.com',
      name: 'GitHub User',
      avatar: 'https://via.placeholder.com/150',
      onboardingCompleted: false,
      onboardingProgress: {
        personalInfo: false,
        skills: false,
        availability: false,
        payment: false,
        review: false,
      },
      skills: [],
      availability: {
        hours_per_week: 0,
        timezone: '',
        preferred_schedule: ''
      },
      payment_details: {
        method: 'paypal',
        paypal_email: '',
        bank_account_name: '',
        bank_account_number: '',
        bank_routing_number: '',
        card_holder_name: '',
        card_number: '',
        card_expiry: '',
        card_cvv: ''
      },
      approvalStatus: 'approved'
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will handle clearing the user state
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateOnboardingProgress = async (step: keyof User['onboardingProgress']) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      onboardingProgress: {
        ...user.onboardingProgress,
        [step]: true,
      },
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Save progress to Supabase
    try {
      const supabaseStep = step === 'personalInfo' ? 'personal_info' : step;
      await UserProfileService.updateOnboardingProgress(user.id, {
        [supabaseStep]: true
      });
    } catch (error) {
      console.error('Error updating onboarding progress in Supabase:', error);
    }
  };

  const completeOnboarding = async (onboardingData?: any) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      onboardingCompleted: true,
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Save complete onboarding data to Supabase
    if (onboardingData) {
      try {
        await UserProfileService.completeOnboarding(user.id, onboardingData);
      } catch (error) {
        console.error('Error completing onboarding in Supabase:', error);
      }
    }
  };

  const refreshUserProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await UserProfileService.getProfile(user.id);
      if (profile) {
        const userData: User = {
          id: profile.user_id,
          email: profile.email,
          name: profile.name,
          avatar: profile.avatar,
          phone: profile.phone,
          location: profile.location,
          bio: profile.bio,
          skills: profile.skills || [],
          availability: profile.availability || {
            hours_per_week: 0,
            timezone: '',
            preferred_schedule: ''
          },
          payment_details: profile.payment_details || {
            method: 'paypal'
          },
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
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  const value = {
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
