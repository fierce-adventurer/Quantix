/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#09090b',
          base: '#060608',
          card: '#111116',
          hover: '#171720',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-amber': 'rgba(255, 107, 0, 0.3)'
        },
        brand: {
          orange: '#ff6b00',
          amber: '#ffa500',
          glow: 'rgba(255, 107, 0, 0.2)'
        }
      },
      boxShadow: {
        'glow-sm': '0 0 16px rgba(255, 107, 0, 0.25)',
        'glow-md': '0 0 30px rgba(255, 107, 0, 0.35)',
        'glow-lg': '0 0 50px rgba(255, 107, 0, 0.45)',
        'glow-button': '0 0 25px rgba(255, 107, 0, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.2)'
      }
    },
  },
  plugins: [],
}
