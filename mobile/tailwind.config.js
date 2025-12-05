/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#006400', // Deep Green
        secondary: '#D4AF37', // Gold-ish
        background: '#F5F5F5',
      },
    },
  },
  plugins: [],
}

