/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Semantic surface tokens ──────────────────────────────────────
        'page':         'rgb(var(--bg-primary-rgb) / <alpha-value>)',
        'muted-bg':     'rgb(var(--bg-secondary-rgb) / <alpha-value>)',
        'card':         'rgb(var(--surface-rgb) / <alpha-value>)',
        'input':        'rgb(var(--surface-raised-rgb) / <alpha-value>)',

        // ── Semantic text tokens ─────────────────────────────────────────
        'content':      'rgb(var(--text-primary-rgb) / <alpha-value>)',
        'sub':          'rgb(var(--text-secondary-rgb) / <alpha-value>)',
        'hint':         'rgb(var(--text-muted-rgb) / <alpha-value>)',

        // ── Accent — saffron orange ──────────────────────────────────────
        'accent':       'rgb(var(--accent-rgb) / <alpha-value>)',
        'accent-light': 'rgb(var(--accent-light-rgb) / <alpha-value>)',
        'accent-pale':  'rgb(var(--accent-pale-rgb) / <alpha-value>)',
        'accent-dark':  'rgb(var(--accent-dark-rgb) / <alpha-value>)',

        // ── Navy — trust / financial ─────────────────────────────────────
        'navy':         'rgb(var(--navy-rgb) / <alpha-value>)',
        'navy-light':   'rgb(var(--navy-light-rgb) / <alpha-value>)',
        'navy-pale':    'rgb(var(--navy-pale-rgb) / <alpha-value>)',

        // ── Borders ──────────────────────────────────────────────────────
        'line':         'rgb(var(--border-rgb) / <alpha-value>)',

        // ── Status ───────────────────────────────────────────────────────
        success:      '#22C55E',
        'success-bg': '#DCFCE7',
        warning:      '#F59E0B',
        error:        '#EF4444',

        // ── Badge tints ──────────────────────────────────────────────────
        badge: {
          govt: '#DFF0E8',
          mf:   '#DFF0E8',
          gold: '#FEF3D8',
          bank: '#DFF0E8',
          nps:  '#E8F5EE',
        },
      },
      fontFamily: {
        sora:          ['Sora', 'sans-serif'],
        'sora-medium': ['Sora', 'sans-serif'],
        hindi:         ['Noto Sans Devanagari', 'sans-serif'],
      },
      borderRadius: {
        sm:   '8px',
        md:   '12px',
        lg:   '16px',
        xl:   '20px',
      },
      maxWidth: {
        mobile: '430px',
      },
    },
  },
  plugins: [],
};