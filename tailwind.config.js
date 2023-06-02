const colors = require('tailwindcss/colors')

module.exports = {
  content: [ 
    './src/**/*.html',
    './src/**/*.{js,jsx,ts,tsx}' 
  ],
  darkMode: 'class',
  theme: {
    colors: {
      ...colors,
      custom: {
        'modal': {
          'background': 'rgba(26,61,96, 0.9)',
          'content-background': '#000'
        },
      }
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}