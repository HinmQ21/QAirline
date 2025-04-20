const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      animation: {
        wiggle: 'wiggle 1.6s linear infinite',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
