/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- AJOUTE CETTE LIGNE ICI
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Optionnel : ajoute les couleurs de ton logo pour les utiliser partout
        wehdaBlue: "#0a192f",
        wehdaGreen: "#4ade80",
      }
    },
  },
  plugins: [],
}