/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          400: '#f8bb27',
          500: '#f2a01f',
          600: '#d98515',
          700: '#b86b10',
        },
        navy: {
          50: '#eef4fa',
          100: '#d9e6f3',
          200: '#b8cee8',
          300: '#8cafda',
          400: '#5f8cc7',
          500: '#3467ad',
          600: '#1d4c89',
          700: '#153a6c',
          800: '#102d54',
          900: '#0b1e38',
          950: '#071427',
        },
        gold: {
          50: '#fff8e7',
          100: '#ffefc2',
          200: '#ffe18a',
          300: '#ffd255',
          400: '#f8bb27',
          500: '#f2a01f',
          600: '#d98515',
          700: '#b86b10',
          800: '#945313',
          900: '#7a4513',
          950: '#462406',
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in':    'fadeIn 0.6s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-up':   'slideUp 0.35s cubic-bezier(0.32,0.72,0,1) forwards',
      },
      keyframes: {
        fadeUp:  { '0%': { opacity: '0', transform: 'translateY(28px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(40px) scale(0.98)' }, '100%': { opacity: '1', transform: 'translateY(0) scale(1)' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow':       'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(242,160,31,0.16), transparent)',
        'brand-gradient':  'linear-gradient(135deg, #071427 0%, #1d4c89 48%, #f2a01f 100%)',
      },
      boxShadow: {
        'glow':        '0 0 40px rgba(29,76,137,0.18)',
        'glow-lg':     '0 0 80px rgba(7,20,39,0.28)',
        'glow-brand':  '0 0 60px rgba(242,160,31,0.20)',
      },
    },
  },
  plugins: [],
}
