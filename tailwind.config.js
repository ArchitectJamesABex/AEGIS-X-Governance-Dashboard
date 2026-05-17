/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'star-twinkle': {
          '0%, 100%': { opacity: 'var(--star-opacity, 0.4)' },
          '50%': { opacity: 'calc(var(--star-opacity, 0.4) * 0.2)' },
        },
        'horizon-breathe': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.9' },
        },
        'ring-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 6px var(--ring-color)) drop-shadow(0 0 14px var(--ring-color))' },
          '50%': { filter: 'drop-shadow(0 0 14px var(--ring-color)) drop-shadow(0 0 28px var(--ring-color))' },
        },
        'score-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'critical-badge': {
          '0%, 100%': { boxShadow: '0 0 6px rgba(239,68,68,0.5), inset 0 0 6px rgba(239,68,68,0.08)' },
          '50%': { boxShadow: '0 0 14px rgba(239,68,68,0.8), inset 0 0 10px rgba(239,68,68,0.15)' },
        },
        'status-dot-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16,185,129,0.6)' },
          '50%': { boxShadow: '0 0 0 4px rgba(16,185,129,0)' },
        },
      },
      animation: {
        'star-twinkle': 'star-twinkle var(--star-dur, 4s) ease-in-out var(--star-delay, 0s) infinite',
        'horizon-breathe': 'horizon-breathe 6s ease-in-out infinite',
        'ring-pulse': 'ring-pulse 3s ease-in-out infinite',
        'score-pulse': 'score-pulse 2.5s ease-in-out infinite',
        'critical-badge': 'critical-badge 2s ease-in-out infinite',
        'status-dot': 'status-dot-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
