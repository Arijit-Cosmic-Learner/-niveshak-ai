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

    // Safety timeout: if Supabase is unreachable, stop loading after 4s
    // so the app remains usable in guest mode
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 4000);

    // Hydrate from existing session (e.g. page refresh)
    supabase.auth.getSession()
      .then(({ data }) => {
        clearTimeout(timeout);
        setUser(data.session?.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        clearTimeout(timeout);
        console.warn('[Auth] Supabase unreachable — guest mode available');
        setLoading(false);
      });

    // Keep store in sync for sign-in / sign-out / token refresh events
    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
      subscription = data.subscription;
    } catch {
      // Supabase listener failed — not critical
    }

    return () => {
      clearTimeout(timeout);
      subscription?.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
