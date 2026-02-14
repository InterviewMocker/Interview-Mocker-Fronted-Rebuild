/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0c0a09', // Stone 950 (Warmer dark)
          900: '#1c1917', // Stone 900
          800: '#292524', // Stone 800
          700: '#44403c', // Stone 700
        },
        primary: {
          400: '#fb923c', // Orange
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        secondary: {
          400: '#fb7185', // Rose
          500: '#f43f5e',
          600: '#e11d48',
        },
        accent: {
          400: '#2dd4bf', // Teal
          500: '#14b8a6',
          600: '#0d9488',
        },
        success: {
          400: '#a3e635', // Lime
          500: '#84cc16',
        },
        warning: {
          400: '#facc15', // Yellow
          500: '#eab308',
        },
        error: {
          400: '#f87171',
          500: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 50%)',
        'card-glass': 'linear-gradient(145deg, rgba(28, 25, 23, 0.4) 0%, rgba(12, 10, 9, 0.4) 100%)',
      },
      animation: {
        'blob': 'blob 10s infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
