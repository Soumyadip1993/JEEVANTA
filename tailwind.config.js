/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#163956',
          hover: '#102a40',
          dark: '#0d2234',
          soft: '#eaf1f7',
          50: '#f0f5fa',
          100: '#e1ecf4',
          200: '#c3d9e9',
          300: '#95bedb',
          400: '#5f9ec8',
          500: '#2b6f9e',
          600: '#163956',
          700: '#102a40',
          800: '#0d2234',
          900: '#081723',
        },
        blue: {
          50: '#f0f5fa',
          100: '#e1ecf4',
          200: '#c3d9e9',
          300: '#95bedb',
          400: '#5f9ec8',
          500: '#2b6f9e',
          600: '#163956', // Primary theme dark blue #163956
          700: '#102a40',
          800: '#0d2234',
          900: '#081723',
        },
      }
    },
  },
  plugins: [],
}
