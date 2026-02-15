/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        race: {
          bg: '#07080c',
          chat: '#0c0d12',
          card: '#161720',
          border: '#1e1f2a',
          accent: '#3b82f6',
          green: '#22c55e',
          yellow: '#eab308',
          red: '#ef4444',
          purple: '#a78bfa',
          delta: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}
