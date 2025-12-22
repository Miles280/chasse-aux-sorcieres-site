/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: { fontFamily: {
        title: ['Sekuya', 'serif'],
        detailUnderTitle: ['Barlow Condensed', 'sans-serif']
    }},
  },
  plugins: [],
}