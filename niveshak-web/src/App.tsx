import { Routes, Route } from 'react-router-dom';
import { t } from '@i18n/index';

function SmokeTest() {
  return (
    <div className="mobile-container flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="bg-lime rounded-sm w-12 h-12 flex items-center justify-center mb-6">
        <span className="text-black font-sora font-extrabold text-lg">
          Ni
        </span>
      </div>
      <h1 className="text-lime font-extrabold text-2xl mb-2 tracking-tight">
        Niveshak.AI
      </h1>
      <p className="text-grey-mid text-sm text-center px-8">
        {t('app.tagline')}
      </p>
      <div className="mt-8 flex flex-col gap-3 w-full px-8">
        <div className="bg-black-light rounded-lg p-4 border border-border-dark">
          <p className="text-off-white text-xs font-semibold uppercase tracking-widest mb-1 text-lime">
            i18n ✓
          </p>
          <p className="text-white text-sm">
            {t('landing.ctaPrimary')}
          </p>
        </div>
        <div className="bg-black-light rounded-lg p-4 border border-border-dark">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-lime">
            Tailwind ✓
          </p>
          <p className="text-white text-sm">
            Design system loaded
          </p>
        </div>
        <div className="bg-black-light rounded-lg p-4 border border-border-dark">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-lime">
            Router ✓
          </p>
          <p className="text-white text-sm">
            React Router v6 active
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SmokeTest />} />
    </Routes>
  );
}