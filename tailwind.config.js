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
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
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
        'hero-glow':       'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(220,38,38,0.12), transparent)',
        'brand-gradient':  'linear-gradient(135deg, #dc2626 0%, #f97316 50%, #f59e0b 100%)',
      },
      boxShadow: {
        'glow':        '0 0 40px rgba(220,38,38,0.15)',
        'glow-lg':     '0 0 80px rgba(220,38,38,0.20)',
        'glow-brand':  '0 0 60px rgba(251,146,60,0.18)',
      },
    },
  },
  plugins: [],
}
