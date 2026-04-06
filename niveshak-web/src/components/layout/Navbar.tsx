import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useThemeStore } from '@store/useThemeStore';
import { useTranslation } from '@hooks/useTranslation';
import { useAuthStore } from '@store/useAuthStore';
import { supabase } from '@lib/supabase';
import { LogoMark } from '@components/common/LogoMark';
import { LanguageToggle } from '@components/common/LanguageToggle';

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
}

const NAV_LINKS = [
  { to: '/home',     label: 'Home'    },
  { to: '/discover', label: 'Discover' },
  { to: '/results',  label: 'My Plan' },
  { to: '/partner',  label: 'Partner' },
] as const;

const REDIRECT_URL = `${window.location.origin}/auth/callback`;

async function signInWithGoogle() {
  if (!supabase) return;
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: REDIRECT_URL },
  });
}

async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { isHindi } = useTranslation();
  const { user, isLoading } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_LABELS: Record<string, { en: string; hi: string }> = {
    '/home':     { en: 'Home',     hi: '\u0918\u0930' },
    '/discover': { en: 'Discover', hi: '\u0916\u094B\u091C\u0947\u0902' },
    '/results':  { en: 'My Plan',  hi: '\u092E\u0947\u0930\u0940 \u092F\u094B\u091C\u0928\u093E' },
    '/partner':  { en: 'Partner',  hi: '\u092A\u093E\u0930\u094D\u091F\u0928\u0930' },
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 bg-card border-b border-line">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <LogoMark size="sm" />
        <span className="font-sora font-extrabold text-content text-sm tracking-tight">
          Niveshak.AI
        </span>
      </div>

      {/* Desktop nav links — hidden on mobile */}
      <nav className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map(({ to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/home'}
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-md font-sora font-medium text-sm transition-colors ${
                isActive
                  ? 'bg-accent-pale text-accent'
                  : 'text-sub hover:text-content hover:bg-input'
              }`
            }
          >
            {isHindi ? NAV_LABELS[to].hi : NAV_LABELS[to].en}
          </NavLink>
        ))}
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <LanguageToggle />
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md bg-input text-hint hover:text-content transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>

        {/* Auth control */}
        {!isLoading && (
          user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-accent/40 transition-all"
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url as string}
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                    <span className="font-sora font-bold text-white text-xs">
                      {(user.email ?? 'U')[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-card border border-line rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-line">
                    <p className="font-sora font-semibold text-content text-xs truncate">
                      {user.user_metadata?.full_name as string ?? user.email}
                    </p>
                    <p className="font-sora text-hint text-[10px] truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); signOut(); }}
                    className="w-full text-left px-4 py-3 font-sora text-xs text-error hover:bg-input transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-input border border-line hover:border-accent/40 transition-colors"
            >
              {/* Google G icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-sora font-semibold text-content text-xs">
                {isHindi ? 'साइन इन' : 'Sign in'}
              </span>
            </button>
          )
        )}
      </div>
    </header>
  );
}