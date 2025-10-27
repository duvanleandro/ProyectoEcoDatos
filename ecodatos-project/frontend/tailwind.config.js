/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D5F2E',
        secondary: '#4A7C59',
        accent: '#66BB6A',
      }
    },
  },
  plugins: [],
}
