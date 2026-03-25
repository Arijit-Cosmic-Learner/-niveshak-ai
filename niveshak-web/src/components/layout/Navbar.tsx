import { useThemeStore } from '@store/useThemeStore';
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

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-card border-b border-line">
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
  );
}