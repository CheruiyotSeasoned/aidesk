import { supabase, UserProfile, OnboardingData } from '@/lib/supabase';

export class UserProfileService {
  // Create or update user profile
  static async upsertProfile(userId: string, data: Partial<UserProfile>) {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...data,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error('Error upserting profile:', error);
      throw error;
    }
  }

  // Get user profile by user ID
  static async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found
          return null;
        }
        throw error;
      }
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Update onboarding progress
  static async updateOnboardingProgress(
    userId: string, 
    progress: Partial<UserProfile['onboarding_progress']>
  ) {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update({
          onboarding_progress: progress,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error('Error updating onboarding progress:', error);
      throw error;
    }
  }

  // Complete onboarding
  static async completeOnboarding(userId: string, onboardingData: OnboardingData) {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          name: onboardingData.name,
          email: onboardingData.email,
          phone: onboardingData.phone,
          location: onboardingData.location,
          bio: onboardingData.bio,
          skills: onboardingData.skills,
          availability: onboardingData.availability,
          payment_details: onboardingData.payment_details,
          onboarding_progress: {
            personal_info: true,
            skills: true,
            availability: true,
            payment: true,
            review: true,
          },
          onboarding_completed: true,
          approval_status: 'pending',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }

  // Update approval status (admin function)
  static async updateApprovalStatus(
    userId: string, 
    status: UserProfile['approval_status'],
    notes?: string
  ) {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update({
          approval_status: status,
          approval_notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error('Error updating approval status:', error);
      throw error;
    }
  }

  // Get all profiles (admin function)
  static async getAllProfiles() {
    try {
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return profiles;
    } catch (error) {
      console.error('Error fetching all profiles:', error);
      throw error;
    }
  }

  // Get profiles by approval status
  static async getProfilesByStatus(status: UserProfile['approval_status']) {
    try {
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('approval_status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return profiles;
    } catch (error) {
      console.error('Error fetching profiles by status:', error);
      throw error;
    }
  }
}
