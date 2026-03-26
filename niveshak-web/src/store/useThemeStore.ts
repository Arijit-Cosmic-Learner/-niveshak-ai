import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const next: Theme = get().theme === 'light' ? 'dark' : 'light';
        // Enable smooth transitions only during the toggle (not on initial page load)
        document.documentElement.classList.add('theme-transitioning');
        document.documentElement.classList.toggle('dark', next === 'dark');
        set({ theme: next });
        setTimeout(() => {
          document.documentElement.classList.remove('theme-transitioning');
        }, 250);
      },
    }),
    {
      name: 'niveshak-theme',
    }
  )
);
