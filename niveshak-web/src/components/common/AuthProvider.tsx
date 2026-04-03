import { useEffect, type ReactNode } from 'react';
import { supabase } from '@lib/supabase';
import { useAuthStore } from '@store/useAuthStore';

interface Props { children: ReactNode; }

/**
 * Mounts once at the app root.
 * - Hydrates the Zustand auth store from the existing Supabase session
 * - Subscribes to onAuthStateChange so the store stays in sync after
 *   Google OAuth redirect, sign-out, or token refresh.
 */
export function AuthProvider({ children }: Props) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Hydrate from existing session (e.g. page refresh)
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Keep store in sync for sign-in / sign-out / token refresh events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
