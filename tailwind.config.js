/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#b8d9ff',
          300: '#86bfff',
          400: '#4d99ff',
          500: '#2477ff',
          600: '#0f57f5',
          700: '#0a44e0',
          800: '#1039b5',
          900: '#13358f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
