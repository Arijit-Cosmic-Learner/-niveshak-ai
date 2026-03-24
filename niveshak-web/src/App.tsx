import { Routes, Route } from 'react-router-dom';
import { Layout } from '@components/layout/Layout';
import LandingPage from '@pages/LandingPage';
import OnboardingPage from '@pages/OnboardingPage';
import ResultsPage from '@pages/ResultsPage';
import PartnerPage from '@pages/PartnerPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"         element={<LandingPage />} />
        <Route path="/discover" element={<OnboardingPage />} />
        <Route path="/results"  element={<ResultsPage />} />
        <Route path="/partner"  element={<PartnerPage />} />
      </Route>
    </Routes>
  );
}