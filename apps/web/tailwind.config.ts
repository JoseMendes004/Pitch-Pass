import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Arena Pro — Night Match palette
        brand: {
          primary: '#c3f400',   // lime green — CTAs, active states
          secondary: '#2d5a27', // pitch green — borders, accents
          dim: '#9ab800',       // primary dimmed — hover states
        },
        surface: {
          bg: '#111508',        // obsidian — root background
          card: '#1a1d10',      // charcoal — cards
          elevated: '#282b1d',  // elevated surfaces
          border: '#343a28',    // subtle borders
          overlay: '#0d0f07',   // deep overlay
        },
        text: {
          primary: '#f0f2e8',   // near-white
          secondary: '#a8b09a', // muted text
          muted: '#6b7560',     // very muted
        },
        status: {
          available: '#c3f400',
          booked: '#ef4444',
          blocked: '#3d4535',
          maintenance: '#f59e0b',
          held: '#fb923c',
        },
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#c3f400',
        // legacy aliases for backward compat during migration
        background: '#111508',
        'surface-2': '#282b1d',
        'surface-container': '#1a1d10',
        'surface-container-high': '#282b1d',
        border: '#343a28',
        primary: '#c3f400',
        'primary-container': '#2d5a27',
        'primary-fixed': '#9ab800',
        'on-primary': '#0d0f07',
        'on-primary-container': '#c3f400',
        secondary: '#2d5a27',
        'secondary-dim': '#1e3e1a',
        'on-surface': '#f0f2e8',
        'on-surface-variant': '#a8b09a',
        'text-muted': '#6b7560',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 4px 24px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(195,244,0,0.06)',
        'glass-lg': '0 8px 40px 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(195,244,0,0.08)',
        'brand-glow': '0 0 20px 0 rgba(195,244,0,0.25)',
        'brand-glow-sm': '0 0 10px 0 rgba(195,244,0,0.15)',
      },
      keyframes: {
        'pulse-green': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-green': 'pulse-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.2s ease-out',
        'fade-in': 'fade-in 0.15s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
