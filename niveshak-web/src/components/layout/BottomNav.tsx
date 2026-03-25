import { NavLink } from 'react-router-dom';
import { useTranslation } from '@hooks/useTranslation';

const NAV_ITEMS = [
  { to: '/',         labelKey: 'nav.home',    icon: '\uD83C\uDFE0' },
  { to: '/discover', labelKey: 'nav.discover', icon: '\uD83D\uDD0D' },
  { to: '/results',  labelKey: 'nav.myPlan',   icon: '\uD83D\uDCCA' },
  { to: '/partner',  labelKey: 'nav.partner',  icon: '\uD83E\uDD1D' },
] as const;

export function BottomNav() {
  const { t } = useTranslation();
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile z-50 bg-card border-t border-line flex items-stretch">
      {NAV_ITEMS.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-sora font-medium transition-colors ${
              isActive ? 'text-accent' : 'text-hint'
            }`
          }
        >
          <span className="text-base">{item.icon}</span>
          <span>{t(item.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}