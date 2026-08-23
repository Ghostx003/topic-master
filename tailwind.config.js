/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'rgb(var(--brand-50-rgb, 239 246 255) / <alpha-value>)',
          100: 'rgb(var(--brand-100-rgb, 219 234 254) / <alpha-value>)',
          200: 'rgb(var(--brand-200-rgb, 191 219 254) / <alpha-value>)',
          300: 'rgb(var(--brand-300-rgb, 147 197 253) / <alpha-value>)',
          400: 'rgb(var(--brand-400-rgb, 96 165 250) / <alpha-value>)',
          500: 'rgb(var(--brand-500-rgb, 59 130 246) / <alpha-value>)',
          600: 'rgb(var(--brand-600-rgb, 37 99 235) / <alpha-value>)',
          700: 'rgb(var(--brand-700-rgb, 29 78 216) / <alpha-value>)',
          800: 'rgb(var(--brand-800-rgb, 30 64 175) / <alpha-value>)',
          900: 'rgb(var(--brand-900-rgb, 30 58 138) / <alpha-value>)',
          950: 'rgb(var(--brand-950-rgb, 23 37 84) / <alpha-value>)',
        },
        surface: {
          50: '#0f172a',
          100: '#1e293b',
          200: '#334155',
          300: '#475569',
          400: '#64748b',
          800: '#090d16',
          900: '#030712',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px var(--brand-glow-sm, rgba(59, 130, 246, 0.25))',
        'glow': '0 0 25px -5px var(--brand-glow, rgba(59, 130, 246, 0.35))',
        'glow-lg': '0 0 35px -5px var(--brand-glow-lg, rgba(59, 130, 246, 0.45))',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        }
      }
    },
  },
  plugins: [],
}
