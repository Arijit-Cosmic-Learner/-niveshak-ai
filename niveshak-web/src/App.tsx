import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@components/layout/Layout';
import { useThemeStore } from '@store/useThemeStore';
import { ErrorBoundary } from '@components/common/ErrorBoundary';
import { AuthProvider } from '@components/common/AuthProvider';
import { ProtectedRoute } from '@components/common/ProtectedRoute';

// Retry helper: if a lazy chunk fails (e.g. stale SW or CDN propagation),
// unregister the service worker, wait briefly, then retry once.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyWithRetry(factory: () => Promise<{ default: React.ComponentType<any> }>) {
  return lazy(() =>
    factory().catch(async () => {
      // Unregister stale service workers so the next fetch hits the network
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      // Brief pause then one final retry
      await new Promise(r => setTimeout(r, 1000));
      return factory();
    })
  );
}

// Lazy-load every page with automatic retry on first failure
const SplashPage         = lazyWithRetry(() => import('@pages/SplashPage'));
const LandingPage        = lazyWithRetry(() => import('@pages/LandingPage'));
const OnboardingPage     = lazyWithRetry(() => import('@pages/OnboardingPage'));
const ResultsPage        = lazyWithRetry(() => import('@pages/ResultsPage'));
const PartnerPage        = lazyWithRetry(() => import('@pages/PartnerPage'));
const NotFoundPage       = lazyWithRetry(() => import('@pages/NotFoundPage'));
const AuthCallbackPage   = lazyWithRetry(() => import('@pages/AuthCallbackPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const theme = useThemeStore((s) => s.theme);

  // Safety net: sync DOM class if store rehydrates from localStorage after mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes — no Layout */}
            <Route path="/"             element={<SplashPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            {/* Protected routes — inside Layout */}
            <Route element={<Layout />}>
              <Route path="/home"     element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
              <Route path="/discover" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
              <Route path="/results"  element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
              <Route path="/partner"  element={<ProtectedRoute><PartnerPage /></ProtectedRoute>} />
              <Route path="*"         element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
}