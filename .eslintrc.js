module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint",
        'prettier' // added
    ],
    "rules": {
        'prettier/prettier': 'error', // added,
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/no-namespace": "off"
    }
}
