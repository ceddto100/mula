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
          50: '#FAF7F2',
          100: '#F5F0E8',
          200: '#EDE8DC',
          300: '#DDD5C3',
          400: '#C9BBA3',
          500: '#B5A086',
          600: '#9A8468',
          700: '#7A6750',
          800: '#3D3228',
          900: '#1A1410',
          950: '#0D0B08',
        },
        accent: {
          gold: '#C9A84C',
          cream: '#F5F0E8',
          warm: '#E8DDD0',
          dark: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        script: ['Great Vibes', 'cursive'],
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
