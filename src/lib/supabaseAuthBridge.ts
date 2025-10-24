import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';

export const supabaseSignInWithFirebase = async () => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return;

  const token = await firebaseUser.getIdToken(true);

  const { error } = await supabase.auth.signInWithIdToken({
    provider: 'firebase',
    token,
  });

  if (error) {
    console.error('❌ Supabase sign-in with Firebase failed:', error);
    throw error;
  }

  console.log('✅ Supabase session established for', firebaseUser.uid);
};
