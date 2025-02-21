const colors = require('tailwindcss/colors')

/**
 * suppress the warning od deprecated colors.
 * @see https://github.com/tailwindlabs/tailwindcss/issues/4690#issuecomment-1046087220
 */
delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

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
        },
        'list-card-background': {
          DEFAULT: 'var(--list-card-background)'
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