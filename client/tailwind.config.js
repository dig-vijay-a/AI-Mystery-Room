/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        detective: {
          dark: '#0a0d14',
          panel: '#111726',
          card: '#161e31',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#f59e0b',
          crimson: '#e11d48',
          cyan: '#06b6d4',
          emerald: '#10b981',
          gold: '#fbbf24'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace', 'ui-monospace'],
        display: ['"Cinzel"', 'serif', 'Georgia'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      }
    },
  },
  plugins: [],
}
