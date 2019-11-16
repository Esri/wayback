module.exports = {
    "extends": [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        'prettier/@typescript-eslint',
        // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
        'plugin:prettier/recommended',
    ],
    "env": {
        "browser": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module"
    },
    "plugins": [
      "@typescript-eslint/eslint-plugin"
    ],
    "rules": {
        "@typescript-eslint/interface-name-prefix": "off",
        "react/prop-types": [2, { ignore: ['children'] }]
    }
}