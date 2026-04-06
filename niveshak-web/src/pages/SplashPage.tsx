import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/useAuthStore';
import { useThemeStore } from '@store/useThemeStore';
import { supabase } from '@lib/supabase';
import { LogoMark } from '@components/common/LogoMark';
import { LanguageToggle } from '@components/common/LanguageToggle';
import { useTranslation } from '@hooks/useTranslation';

const REDIRECT_URL = `${window.location.origin}/auth/callback`;

async function signInWithGoogle() {
  if (!supabase) return;
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: REDIRECT_URL },
  });
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
}

export default function SplashPage() {
  const navigate   = useNavigate();
  const user       = useAuthStore(s => s.user);
  const isLoading  = useAuthStore(s => s.isLoading);
  const { theme, toggleTheme } = useThemeStore();
  const { isHindi } = useTranslation();

  // Already signed in — skip splash and go straight to the app
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/home', { replace: true });
    }
  }, [isLoading, user, navigate]);

  return (
    <div className="min-h-screen bg-page flex flex-col">
      {/* Top bar — matches Navbar style */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-line bg-card">
        <div className="flex items-center gap-2">
          <LogoMark size="sm" />
          <span className="font-sora font-extrabold text-content text-sm tracking-tight">
            Niveshak.AI
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md bg-input text-hint hover:text-content transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </header>

      {/* Main content — centred */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-10">
        {/* Logo + wordmark */}
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 bg-navy rounded-xl flex items-center justify-center shadow-md">
            <span className="font-sora font-extrabold text-white text-2xl leading-none">Ni</span>
          </div>
          <div>
            <div className="inline-flex items-center bg-navy-pale border border-navy/20 rounded-full px-3 py-1 mb-3">
              <span className="text-[10px] text-navy font-semibold font-sora tracking-wide">
                {isHindi ? 'भारत का पहला लक्ष्य-आधारित निवेश प्लेटफ़ॉर्म' : 'India\'s #1 Goal-Matched Investment Platform'}
              </span>
            </div>
            <h1 className="font-sora font-extrabold text-content text-3xl tracking-tight">
              Niveshak.AI
            </h1>
            <p className="text-sub text-sm mt-2 max-w-xs leading-relaxed">
              {isHindi
                ? 'अपने सपनों के लिए सही निवेश खोजें — AI की मदद से'
                : 'Discover the right investments for your goals — powered by AI'}
            </p>
          </div>
        </div>

        {/* Sign-in card */}
        <div className="w-full max-w-sm bg-card border border-line rounded-xl p-6 flex flex-col gap-4 shadow-sm">
          <p className="font-sora font-semibold text-content text-sm text-center">
            {isHindi ? 'शुरू करने के लिए साइन इन करें' : 'Sign in to get started'}
          </p>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-lg bg-input border border-line hover:border-accent/50 hover:bg-accent-pale transition-all font-sora font-semibold text-content text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isHindi ? 'Google से जारी रखें' : 'Continue with Google'}
          </button>

          <p className="text-hint text-[11px] text-center leading-relaxed">
            {isHindi
              ? 'जारी रखकर आप हमारी सेवा शर्तों से सहमत होते हैं। आपका डेटा कभी नहीं बेचा जाता।'
              : 'By continuing you agree to our terms. Your data is never sold.'}
          </p>
        </div>

        {/* Trust band */}
        <p className="text-hint text-xs text-center font-sora">
          {isHindi ? '🔒 सुरक्षित · कोई शुल्क नहीं · SEBI-पंजीकृत सलाहकारों द्वारा समर्थित' : '🔒 Secure · Free to use · Backed by SEBI-registered advisors'}
        </p>
      </div>
    </div>
  );
}
