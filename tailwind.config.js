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
        background: {
          dark: '#090B16',
          secondary: '#111529',
          card: '#171D35',
          light: '#F8FAFC',
          lightCard: '#FFFFFF',
          lightSecondary: '#F1F5F9'
        },
        primary: {
          accent: '#8B5CF6',
          hover: '#7C3AED',
          light: '#DDD6FE'
        },
        secondary: {
          accent: '#22D3EE',
          hover: '#06B6D4'
        },
        highlight: '#A78BFA',
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#F87171'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(139, 92, 246, 0.2), 0 0 20px rgba(34, 211, 238, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.4), 0 0 35px rgba(34, 211, 238, 0.2)' }
        }
      }
    },
  },
  plugins: [],
}
