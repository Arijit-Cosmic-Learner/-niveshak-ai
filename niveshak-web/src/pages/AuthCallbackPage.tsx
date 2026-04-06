import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/useAuthStore';

/**
 * Landing page for the Google OAuth redirect.
 * Supabase (via AuthProvider's onAuthStateChange) fires automatically when the
 * authorisation code in the URL hash is exchanged for a session.
 * All we do here is wait for isLoading to settle, then send the user somewhere.
 */
export default function AuthCallbackPage() {
  const navigate  = useNavigate();
  const user      = useAuthStore(s => s.user);
  const isLoading = useAuthStore(s => s.isLoading);

  useEffect(() => {
    if (isLoading) return;
    // Signed-in successfully → go to results; otherwise back to home
    navigate(user ? '/home' : '/', { replace: true });
  }, [isLoading, user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
        <p className="font-sora text-hint text-sm">Signing you in…</p>
      </div>
    </div>
  );
}
