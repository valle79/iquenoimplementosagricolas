/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '90rem',
      },
      colors: {
        'tractor': {
          50: '#f0f9f0',
          100: '#dcf0dc',
          200: '#367c2b',  // Verde John Deere principal
          300: '#2b6022',
          400: '#1f4418',
          500: '#14290f',
        },
        'machinery': {
          50: '#fff9e6',
          100: '#fff0b3',
          200: '#ffdb4d',  // Amarillo maquinaria principal
          300: '#ffd11a',
          400: '#e6b800',
          500: '#b38f00',
        }
      }
    },
  },

};
