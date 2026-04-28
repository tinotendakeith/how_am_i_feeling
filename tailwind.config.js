/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paradiseTeal: '#1F7A8C',
        healingGreen: '#2BAE66',
        softMist: '#F5F7F6',
        ink: '#2E2E2E',
      },
      fontFamily: {
        heading: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        body: ['Inter', 'Lato', 'Open Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px rgba(31, 122, 140, 0.12)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 420ms ease-out both',
      },
    },
  },
  plugins: [],
};
