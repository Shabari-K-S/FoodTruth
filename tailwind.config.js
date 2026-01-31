/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        surface: 'var(--color-surface)',
        foreground: 'var(--color-foreground)',
        primary: {
          DEFAULT: '#0D9488', // Sage Green (Teal 600)
          foreground: '#FFFFFF',
        },
        caution: {
          DEFAULT: '#F59E0B', // Goldenrod (Amber 500)
          foreground: '#FFFFFF',
        },
        danger: {
          DEFAULT: '#EF4444', // Coral Red (Red 500)
          foreground: '#FFFFFF',
        },
        muted: '#71717A', // Zinc 500
        border: '#E4E4E7', // Zinc 200
        // Design System 2.0 Semantic Colors
        sage: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#0D9488', // Primary
          600: '#0F766E',
          700: '#0E7490',
          900: '#134E4A',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B', // Caution
          600: '#D97706',
        },
        coral: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444', // Avoid/High Processed
          600: '#DC2626',
        },
        purple: {
          500: '#7C3AED', // Ultra-Processed Alert
          900: '#4C1D95',
        },
        mint: {
          100: '#D1FAE5', // Natural Glow
          500: '#10B981',
        },
        zinc: {
          50: '#FAFAFA', // Light Mode Base
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          800: '#27272A',
          900: '#18181B', // Dark Mode Card
          950: '#020617', // Dark Mode Base
        }
      },
      fontFamily: {
        display: ['Outfit_700Bold'],
        body: ['Lexend_400Regular'],
        'body-bold': ['Lexend_700Bold'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
