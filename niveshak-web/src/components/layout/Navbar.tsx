import { LogoMark } from '@components/common/LogoMark';
import { LanguageToggle } from '@components/common/LanguageToggle';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-black border-b border-border-dark">
      <div className="flex items-center gap-2">
        <LogoMark size="sm" />
        <span className="font-sora font-extrabold text-white text-sm tracking-tight">
          Niveshak.AI
        </span>
      </div>
      <LanguageToggle />
    </header>
  );
}
