/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#FF6B6B',
          secondary: '#4D96FF',
          yellow: '#FFD93D',
          lime: '#6BCB77',
          purple: '#9D4EDD',
          orange: '#FF9F43',
        },
        background: '#FFFDF9',
        foreground: '#2D3436',
        border: '#E2E8F0',
      },
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
        accent: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
