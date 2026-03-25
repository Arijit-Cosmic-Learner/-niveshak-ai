import { NavLink } from 'react-router-dom';
import { useThemeStore } from '@store/useThemeStore';
import { useTranslation } from '@hooks/useTranslation';
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
  { to: '/',         label: 'Home'    },
  { to: '/discover', label: 'Discover' },
  { to: '/results',  label: 'My Plan' },
  { to: '/partner',  label: 'Partner' },
] as const;

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { isHindi } = useTranslation();

  const NAV_LABELS: Record<string, { en: string; hi: string }> = {
    '/':         { en: 'Home',     hi: '\u0918\u0930' },
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
            end={to === '/'}
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
      </div>
    </header>
  );
}