/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false
},
  theme: {
    extend: {
      colors: {
        chatBlue: "#1E90FF"
      }
    },
  },
  plugins: [],
}

