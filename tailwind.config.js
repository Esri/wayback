module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.{js,jsx,ts,tsx}', 
  ],
  darkMode: 'class', // or 'media' or false
  theme: {
    extend: {
      colors: {
        sky: require('tailwindcss/colors').sky,
        stone: require('tailwindcss/colors').stone,
        neutral: require('tailwindcss/colors').neutral,
        gray: require('tailwindcss/colors').gray,
        slate: require('tailwindcss/colors').slate,
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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
