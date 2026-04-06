import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@store/useAuthStore';

interface Props { children: ReactNode; }

export function ProtectedRoute({ children }: Props) {
  const user = useAuthStore(s => s.user);
  const isLoading = useAuthStore(s => s.isLoading);

  // Still hydrating Supabase session — show full-screen spinner
  // (avoids flash of content before redirect)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not signed in — send to splash login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
