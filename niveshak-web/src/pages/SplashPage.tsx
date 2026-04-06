import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/useAuthStore';
import { useThemeStore } from '@store/useThemeStore';
import { supabase } from '@lib/supabase';
import { LogoMark } from '@components/common/LogoMark';
import { LanguageToggle } from '@components/common/LanguageToggle';
import { TradingViewChart } from '@components/common/TradingViewChart';
import { useTranslation } from '@hooks/useTranslation';

// ── Trusted partner list ───────────────────────────────────────────────────
const PARTNERS: { name: string; color: string; domain: string; category: 'bank' | 'psp' | 'mf' }[] = [
  { name: 'HDFC Bank',        color: '#004C8F', domain: 'hdfcbank.com',         category: 'bank' },
  { name: 'Axis Bank',        color: '#97144D', domain: 'axisbank.com',         category: 'bank' },
  { name: 'SBI',              color: '#2D64AF', domain: 'sbi.co.in',            category: 'bank' },
  { name: 'ICICI Bank',       color: '#F47820', domain: 'icicibank.com',        category: 'bank' },
  { name: 'Google Pay',       color: '#4285F4', domain: 'pay.google.com',       category: 'psp'  },
  { name: 'PhonePe',          color: '#5F259F', domain: 'phonepe.com',          category: 'psp'  },
  { name: 'Paytm',            color: '#002970', domain: 'paytm.com',            category: 'psp'  },
  { name: 'Groww',            color: '#00D09C', domain: 'groww.in',             category: 'psp'  },
  { name: 'Zerodha',          color: '#387ED1', domain: 'zerodha.com',          category: 'psp'  },
  { name: 'Parag Parikh MF',  color: '#1A4030', domain: 'ppfas.com',            category: 'mf'   },
  { name: 'Motilal Oswal MF', color: '#E31837', domain: 'motilaloswalmf.com',   category: 'mf'   },
  { name: 'Bandhan Bank',     color: '#ED1C24', domain: 'bandhanbank.com',      category: 'bank' },
  { name: 'PNB',              color: '#FF6B00', domain: 'pnbindia.in',          category: 'bank' },
  { name: 'Juspay',           color: '#2B47AD', domain: 'juspay.in',            category: 'psp'  },
];

// Pill chip for one partner — shows real logo via Clearbit, falls back to colored dot
function PartnerChip({ name, color, domain }: { name: string; color: string; domain: string }) {
  const [logoOk, setLogoOk] = useState(true);
  const src = `https://logo.clearbit.com/${domain}`;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-line rounded-full flex-shrink-0">
      {logoOk ? (
        <img
          src={src}
          alt={name}
          width={16}
          height={16}
          className="w-4 h-4 rounded-sm object-contain flex-shrink-0"
          onError={() => setLogoOk(false)}
        />
      ) : (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="font-sora text-xs text-sub whitespace-nowrap">{name}</span>
    </div>
  );
}

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

  // While the Supabase session is hydrating, show a full-screen spinner
  // so logged-in users never see a flash of the sign-in UI
  if (isLoading) {
    return (
      <div className="h-screen bg-page flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen bg-page flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-line bg-card shrink-0">
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

      {/* Body — side by side on desktop, stacked on mobile */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">

        {/* ── Left: Login ─────────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-center px-6 py-8 gap-5 lg:w-[42%] lg:border-r lg:border-line lg:overflow-y-auto">
          {/* Logo + wordmark */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center shadow-md">
              <span className="font-sora font-extrabold text-white text-xl leading-none">Ni</span>
            </div>
            <div>
              <div className="inline-flex items-center bg-navy-pale border border-navy/20 rounded-full px-3 py-1 mb-2">
                <span className="text-[10px] text-navy font-semibold font-sora tracking-wide">
                  {isHindi ? 'भारत का पहला लक्ष्य-आधारित निवेश प्लेटफ़ॉर्म' : "India's #1 Goal-Matched Investment Platform"}
                </span>
              </div>
              <h1 className="font-sora font-extrabold text-content text-2xl tracking-tight">
                Niveshak.AI
              </h1>
              <p className="text-sub text-xs mt-1.5 max-w-[220px] leading-relaxed">
                {isHindi
                  ? 'अपने सपनों के लिए सही निवेश खोजें — AI की मदद से'
                  : 'Right investments for your goals — powered by AI'}
              </p>
            </div>
          </div>

          {/* Sign-in card */}
          <div className="w-full max-w-xs bg-card border border-line rounded-xl p-5 flex flex-col gap-3 shadow-sm">
            <p className="font-sora font-semibold text-content text-xs text-center">
              {isHindi ? 'शुरू करने के लिए साइन इन करें' : 'Sign in to get started'}
            </p>

            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg bg-input border border-line hover:border-accent/50 hover:bg-accent-pale transition-all font-sora font-semibold text-content text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
          <p className="text-hint text-[11px] text-center font-sora">
            {isHindi ? '🔒 सुरक्षित · कोई शुल्क नहीं · SEBI-पंजीकृत' : '🔒 Secure · Free · Backed by SEBI advisors'}
          </p>
        </div>

        {/* ── Right: Live market charts ────────────────────────────────── */}
        <div className="flex-1 flex flex-col px-5 py-5 gap-3 border-t border-line lg:border-t-0 lg:overflow-y-auto">
          <p className="text-[10px] font-semibold text-hint font-sora uppercase tracking-widest">
            {isHindi ? 'लाइव बाज़ार' : 'Live Market Pulse'}
          </p>
          <TradingViewChart
            symbol="NSE:NIFTY50"
            label={isHindi ? 'निफ्टी 50' : 'Nifty 50'}
          />
          <TradingViewChart
            symbol="MCX:GOLD1!"
            label={isHindi ? 'सोना · MCX (₹/10g)' : 'Gold · MCX (₹ / 10g)'}
          />
          <TradingViewChart
            symbol="FX_IDC:USDINR"
            label={isHindi ? 'USD → INR' : 'USD / INR'}
          />
        </div>
      </div>

      {/* ── Partner carousel strip ────────────────────────────────────────── */}
      <div className="border-t border-line bg-card shrink-0 pt-3 pb-4">
        <p className="text-center text-[10px] text-hint font-sora uppercase tracking-widest mb-3 px-4">
          {isHindi ? 'आपके पसंदीदा ऐप्स के साथ काम करता है' : 'Works with your favourite apps & banks'}
        </p>
        <div className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10"
            style={{ background: 'linear-gradient(to right, rgb(var(--surface-rgb)), transparent)' }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10"
            style={{ background: 'linear-gradient(to left, rgb(var(--surface-rgb)), transparent)' }}
          />
          <div className="flex gap-2.5 px-3 w-max animate-marquee">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <PartnerChip key={i} name={p.name} color={p.color} domain={p.domain} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
