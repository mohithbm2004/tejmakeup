/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        champagne: {
          50: '#FDFBF7',
          100: '#FAF6ED',
          200: '#F2E8D2',
          300: '#E6D4AF',
          400: '#D5BD86',
          500: '#C5A059', // primary gold
          600: '#B08842',
          700: '#8E6B30',
          800: '#6C4F22',
          900: '#4D3616',
        },
        ivory: {
          DEFAULT: '#FDFCF7',
          50: '#FFFFFF',
          100: '#FAF8F2',
          200: '#F5F1E6',
          300: '#EDE5D4',
          400: '#E0D4BD',
        },
        sand: {
          50: '#FBF9F6',
          100: '#F6F2EB',
          200: '#EDE5D8',
          300: '#DDD1BD',
          400: '#C4B59D',
          500: '#A9967C',
          600: '#8A775E',
          700: '#6C5C48',
          800: '#4E4233',
          900: '#322B21',
        },
        noir: {
          DEFAULT: '#141210',
          50: '#2A2622',
          100: '#221E1B',
          200: '#1C1917',
          300: '#151311',
          400: '#0F0E0C',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Didot', 'Bodoni MT', 'Cinzel', 'serif'],
        sans: ['"Montserrat"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
        ultra: '.3em',
      }
    },
  },
  plugins: [],
}
