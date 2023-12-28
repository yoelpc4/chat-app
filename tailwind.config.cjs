/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Lato', 'Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#1164a3',
        secondary: '#3f0e40',
        tertiary: '#92959e',
        online: '#86bb71',
        offline: '#e38968',
      },
    },
  },
  plugins: [],
}
