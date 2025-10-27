/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          bg: '#0a0e27',
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#ec4899',
          star: '#fbbf24',
        },
      },
      animation: {
        'orbit': 'orbit var(--duration) linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(var(--radius)) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(var(--radius)) rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [],
}
