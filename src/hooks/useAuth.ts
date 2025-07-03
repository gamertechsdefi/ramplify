import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { createSmartAccount } from '@/lib/zeroDev';
import type { User } from '@/lib/types';

export const useAuth = () => {
  const router = useRouter();
  const { user, setUser, setSmartAccountAddress, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      if (session?.user) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userProfile) {
          setUser(userProfile);
          setSmartAccountAddress(userProfile.smart_account_address || null);
        } else {
          const newUser: User = {
            id: session.user.id,
            email: session.user.email!,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          const { data: createdUser } = await supabase
            .from('users')
            .insert([newUser])
            .select()
            .single();

          if (createdUser) {
            setUser(createdUser);
            const smartAccount = await createSmartAccount(createdUser.id);
            setSmartAccountAddress(smartAccount.address);
          }
        }
      } else {
        setUser(null);
        setSmartAccountAddress(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSmartAccountAddress, setLoading]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { user: data.user, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (data.user && !error) {
      const smartAccount = await createSmartAccount(data.user.id);
      setSmartAccountAddress(smartAccount.address);
    }
    return { user: data.user, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/login');
  };

  return { user, signIn, signUp, signOut, isAuthenticated: !!user };
};