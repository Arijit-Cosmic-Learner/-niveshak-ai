/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: '#0D0D0D',
          light:   '#1A1A1A',
          mid:     '#2A2A2A',
          soft:    '#3A3A3A',
        },
        lime: {
          DEFAULT: '#AAFF00',
          light:   '#C2FF4D',
          pale:    '#EEFFCC',
          dark:    '#7ACC00',
        },
        'off-white':    '#F5F5F5',
        'grey-light':   '#F0F0F0',
        'grey-mid':     '#B0B0B0',
        'grey-dark':    '#6B6B6B',
        'border-dark':  '#2A2A2A',
        'border-light': '#E0E0E0',
        text: {
          'on-black':  '#FFFFFF',
          'on-lime':   '#0D0D0D',
          primary:     '#0D0D0D',
          secondary:   '#3A3A3A',
          muted:       '#6B6B6B',
        },
        success:      '#22C55E',
        'success-bg': '#DCFCE7',
        warning:      '#F59E0B',
        error:        '#EF4444',
        badge: {
          govt: '#EEFFCC',
          mf:   '#E8F0FB',
          gold: '#FEF3D8',
          bank: '#F0EAFA',
          nps:  '#FFF0E6',
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

