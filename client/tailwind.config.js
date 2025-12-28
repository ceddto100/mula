/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EBF3F9',
          100: '#D7E7F3',
          200: '#AFCFE7',
          300: '#87B7DB',
          400: '#5F9FCF',
          500: '#4A7BA7', // Primary logo blue
          600: '#3B6285',
          700: '#2C4A64',
          800: '#1E3142',
          900: '#0F1921',
        },
        accent: {
          electric: '#00E5FF',
          neon: '#00FFA3',
          sunset: '#FF6B35',
          purple: '#9D4EDD',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        grotesk: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      clipPath: {
        arrow: 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)',
        diagonal: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
      },
    },
  },
  plugins: [],
};
