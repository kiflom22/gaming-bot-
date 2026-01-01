/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0f0f1a',
          800: '#1a1a2e',
          700: '#16213e',
          600: '#2a2a4e',
        }
      },
      animation: {
        'spin-fast': 'spin 0.1s linear infinite',
        'bounce-slow': 'bounce 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}
