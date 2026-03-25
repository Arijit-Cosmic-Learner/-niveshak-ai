import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@components/layout/Layout';
import { useThemeStore } from '@store/useThemeStore';
import { ErrorBoundary } from '@components/common/ErrorBoundary';

// Lazy-load every page for smaller initial bundle
const LandingPage    = lazy(() => import('@pages/LandingPage'));
const OnboardingPage = lazy(() => import('@pages/OnboardingPage'));
const ResultsPage    = lazy(() => import('@pages/ResultsPage'));
const PartnerPage    = lazy(() => import('@pages/PartnerPage'));
const NotFoundPage   = lazy(() => import('@pages/NotFoundPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-[3px] border-lime border-t-transparent rounded-full animate-spin" />
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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"         element={<LandingPage />} />
            <Route path="/discover" element={<OnboardingPage />} />
            <Route path="/results"  element={<ResultsPage />} />
            <Route path="/partner"  element={<PartnerPage />} />
            <Route path="*"         element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}