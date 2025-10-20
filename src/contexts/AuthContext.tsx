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

  // Helper function to create basic user data from Firebase user
  const createBasicUserData = (firebaseUser: FirebaseUser): User => {
    return {
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
  };

  // Helper function to create a new user profile in Supabase
  const createUserProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
    try {
      console.log('Creating new profile for user:', firebaseUser.uid);
      const newProfile = await UserProfileService.upsertProfile(firebaseUser.uid, {
        user_id: firebaseUser.uid,
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
        onboarding_completed: false,
        onboarding_progress: {
          personal_info: false,
          skills: false,
          availability: false,
          payment: false,
          review: false,
        },
        approval_status: 'pending',
      });

      console.log('Profile created successfully:', newProfile);

      return {
        id: newProfile.user_id,
        email: newProfile.email,
        name: newProfile.name,
        avatar: newProfile.avatar,
        phone: newProfile.phone,
        location: newProfile.location,
        bio: newProfile.bio,
        skills: newProfile.skills || [],
        availability: newProfile.availability || {
          hours_per_week: 0,
          timezone: '',
          preferred_schedule: ''
        },
        payment_details: newProfile.payment_details || {
          method: 'paypal'
        },
        onboardingCompleted: newProfile.onboarding_completed,
        onboardingProgress: {
          personalInfo: newProfile.onboarding_progress?.personal_info || false,
          skills: newProfile.onboarding_progress?.skills || false,
          availability: newProfile.onboarding_progress?.availability || false,
          payment: newProfile.onboarding_progress?.payment || false,
          review: newProfile.onboarding_progress?.review || false,
        },
        approvalStatus: newProfile.approval_status,
        approvalNotes: newProfile.approval_notes,
      };
    } catch (error) {
      console.error('Error creating user profile in Supabase:', error);
      // Return basic user data if profile creation fails
      return createBasicUserData(firebaseUser);
    }
  };

  // Convert Supabase profile to User format
  const convertProfileToUser = (profile: UserProfile): User => {
    return {
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
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in - try to get profile from Supabase first
        try {
          console.log('Fetching profile for user:', firebaseUser.uid);
          const profile = await UserProfileService.getProfile(firebaseUser.uid);
          
          if (profile) {
            // Profile exists, convert and use it
            console.log('Profile found:', profile);
            const userData = convertProfileToUser(profile);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            // Profile doesn't exist, create one
            console.log('No profile found, creating new profile...');
            const userData = await createUserProfile(firebaseUser);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (error: any) {
          console.error('Error in profile handling:', error);
          
          // Check if it's the "0 rows" PGRST116 error
          if (error?.code === 'PGRST116' || error?.message?.includes('0 rows')) {
            console.log('PGRST116 error detected, creating new profile...');
            const userData = await createUserProfile(firebaseUser);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            // For other errors, fallback to basic user data
            console.log('Using fallback basic user data');
            const userData = createBasicUserData(firebaseUser);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }
      } else {
        // User is signed out
        console.log('User signed out');
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle updating the user state and creating profile
      console.log('User created in Firebase:', userCredential.user.uid);
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
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google login successful:', result.user.uid);
      // onAuthStateChanged will handle updating the user state and creating profile if needed
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
      
      // First, try to get the profile
      try {
        await UserProfileService.getProfile(user.id);
        // Profile exists, update it
        await UserProfileService.updateOnboardingProgress(user.id, {
          [supabaseStep]: true
        });
      } catch (error: any) {
        // If profile doesn't exist (PGRST116), create it first
        if (error?.code === 'PGRST116' || error?.message?.includes('0 rows')) {
          console.log('Profile not found, creating it before updating progress...');
          
          // Get current Firebase user to create profile
          if (auth.currentUser) {
            await createUserProfile(auth.currentUser);
            // Now try to update again
            await UserProfileService.updateOnboardingProgress(user.id, {
              [supabaseStep]: true
            });
          }
        } else {
          throw error;
        }
      }
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
        // Check if profile exists first
        try {
          await UserProfileService.getProfile(user.id);
          // Profile exists, update it
          await UserProfileService.completeOnboarding(user.id, onboardingData);
        } catch (error: any) {
          // If profile doesn't exist (PGRST116), create it first
          if (error?.code === 'PGRST116' || error?.message?.includes('0 rows')) {
            console.log('Profile not found, creating it before completing onboarding...');
            
            if (auth.currentUser) {
              // Create profile with onboarding data
              await UserProfileService.upsertProfile(user.id, {
                ...onboardingData,
                onboarding_completed: true,
                onboarding_progress: {
                  personal_info: true,
                  skills: true,
                  availability: true,
                  payment: true,
                  review: true,
                },
                approval_status: 'pending',
              });
            }
          } else {
            throw error;
          }
        }
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
        const userData = convertProfileToUser(profile);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error: any) {
      console.error('Error refreshing user profile:', error);
      
      // If PGRST116 error, try to create profile
      if (error?.code === 'PGRST116' && auth.currentUser) {
        const newUser = await createUserProfile(auth.currentUser);
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      }
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