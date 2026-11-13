/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        agriva: {
          forest: '#1B4332',
          pine: '#2D6A4F',
          sage: '#52796F',
          leaf: '#40916C',
          mint: '#D8F3DC',
          cream: '#FBF8F1',
          oat: '#F3EFE4',
          earth: '#8C5E3C',
          clay: '#B07D56',
          ink: '#1C241E',
          muted: '#5A675D',
          line: '#E2DDD0',
          gold: '#C99A3B',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', '"Instrument Sans"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px -12px rgba(27, 67, 50, 0.10)',
        card: '0 2px 14px -4px rgba(27, 67, 50, 0.08)',
      },
    },
  },
  plugins: [],
};

