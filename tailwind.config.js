/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: { 
      fontFamily: {
        title: ['Sekuya', 'serif'],
        detailUnderTitle: ['Barlow Condensed', 'sans-serif'],
        test: ['Cinzel Decorative', 'sans-serif'],
        test2: ['Cinzel', 'serif']
      },
       colors: {
        villageois: "rgb(var(--villageois) / <alpha-value>)",
        sorcières: "rgb(var(--sorcières) / <alpha-value>)",
        indépendants: "rgb(var(--indépendants) / <alpha-value>)",
      },
    }
  },
  plugins: [],
}