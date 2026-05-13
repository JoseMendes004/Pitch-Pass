/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#111118',
        'surface-2': '#1a1a24',
        primary: '#22c55e',
        'primary-dim': '#15803d',
        danger: '#ef4444',
        warning: '#f59e0b',
        muted: '#64748b',
      },
    },
  },
}
