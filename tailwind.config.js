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
        'theme': {
          'blue': {
            DEFAULT: '#2267AE',
            'brand': '#0079c1',
            'light': '#56a5d8',
            'dark': '#1A3D60'
          }
        },
        'background': {
          DEFAULT: '#121212'
        },
        'foreground': {
          DEFAULT: '#ccc'
        }
      }
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}