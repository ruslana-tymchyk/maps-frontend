/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        baseoutlineblue: '#00b4d8',
        hoveroutlineblue: '#008aa5',
        darkerblue: '#0095b6',
        evendarkerblue: '#006080',
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

