/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm palette — adapted from FitnessAiManager/Sivania design system
        sand: {
          DEFAULT: '#d8d0ba',
          50: '#faf9f5',
          100: '#f5f3ed',
          200: '#e8e4d8',
          300: '#d8d0ba',
          400: '#c4b89e',
          500: '#b8a890',
          600: '#a08c72',
          700: '#857358',
          800: '#6b5c47',
          900: '#574b3b',
        },
        sage: {
          DEFAULT: '#698472',
          50: '#f4f7f5',
          100: '#e6ece8',
          200: '#cdd9d1',
          300: '#a8bfaf',
          400: '#8a9f91',
          500: '#698472',
          600: '#536a5b',
          700: '#44564a',
          800: '#39463e',
          900: '#303b34',
        },
        terracotta: {
          DEFAULT: '#8e6a59',
          50: '#faf6f4',
          100: '#f4ebe6',
          200: '#e8d5cc',
          300: '#d9b9a8',
          400: '#c69a84',
          500: '#b08a79',
          600: '#8e6a59',
          700: '#76574a',
          800: '#624940',
          900: '#523f38',
        },
        parchment: '#f5f3ed',
        cream: '#faf9f5',
        charcoal: '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        subtle: '0 2px 8px rgba(142, 106, 89, 0.08)',
        soft: '0 4px 16px rgba(142, 106, 89, 0.12)',
        elevated: '0 8px 32px rgba(142, 106, 89, 0.16)',
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
}
