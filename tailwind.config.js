const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#36A2DA",
      }
    },
  },
  plugins: [],
}
