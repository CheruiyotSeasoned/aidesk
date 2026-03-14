import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hzbyxikbbdlgjtspispt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_AeKLhHAv4YTtB8iOopM_hg_e0s-NAte';

// Check if using demo configuration
const isDemoConfig = supabaseUrl === 'https://hzbyxikbbdlgjtspispt.supabase.co';

if (isDemoConfig) {
  console.warn("⚠️ Using demo Supabase configuration. Please set up your environment variables:");
  console.warn("1. Create a .env.local file in your project root");
  console.warn("2. Add your Supabase configuration variables");
  console.warn("3. See SUPABASE_SETUP.md for detailed instructions");
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
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
  onboarding_progress: {
    personal_info: boolean;
    skills: boolean;
    availability: boolean;
    payment: boolean;
    review: boolean;
  };
  onboarding_completed: boolean;
  approval_status: 'pending' | 'approved' | 'rejected' | 'under_review';
  approval_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OnboardingData {
  name: string;
  email: string;
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
}
