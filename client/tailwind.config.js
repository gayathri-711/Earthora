/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        earthora: {
          forest: '#0D2B1D',
          deep: '#091F15',
          olive: '#3E5C3B',
          sage: '#7E9F83',
          mint: '#10B981',
          emerald: '#059669',
          ivory: '#FAF8F2',
          beige: '#EDE8DC',
          sand: '#E2DBD0',
          charcoal: '#18201B',
          muted: '#526357',
          gold: '#D4A346',
          sky: '#0284C7',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        editorial: ['"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(13, 43, 29, 0.05)',
        card: '0 4px 20px -2px rgba(13, 43, 29, 0.06), 0 2px 6px -1px rgba(13, 43, 29, 0.03)',
        elevated: '0 20px 35px -5px rgba(13, 43, 29, 0.10), 0 8px 10px -6px rgba(13, 43, 29, 0.05)',
      },
    },
  },
  plugins: [],
};
