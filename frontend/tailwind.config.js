/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ielts: {
          red: "#d9222a",
          dark: "#0f172a",
          card: "#1e293b",
          blue: "#2563eb",
          accent: "#38bdf8"
        }
      }
    },
  },
  plugins: [],
}
