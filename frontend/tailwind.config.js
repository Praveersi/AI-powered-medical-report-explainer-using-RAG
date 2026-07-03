/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans:    ['Inter', 'sans-serif'],
      },
      colors: {
        navy:  '#0F172A', 
        sky:   '#0EA5E9', 
        teal:  '#0D9488', 
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 32px rgba(14,165,233,0.12)',
      },
    },
  },
  plugins: [],
}
