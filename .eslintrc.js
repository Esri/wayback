module.exports = {
    // Define the environment the code runs in.
    // Enables browser global variables like `window` and `document`,
    // and sets ECMAScript features to 2021 (e.g., optional chaining).
    env: {
        browser: true,
        es2021: true,
    },

    // Base configurations to extend. These enable recommended linting rules.
    extends: [
        'eslint:recommended', // ESLint's base recommended rules
        'plugin:react/recommended', // Recommended rules for React
        'plugin:@typescript-eslint/recommended', // Recommended rules for TypeScript

        // 'prettier' disables ESLint rules that conflict with Prettier formatting.
        // Only needed if using Prettier with ESLint.
        // Uncomment if you're using eslint to report formatting issues.
        // 'prettier'
    ],

    // You can define override rules for specific files here (e.g., test files)
    overrides: [],

    // Use the TypeScript parser so ESLint can understand TypeScript syntax
    parser: '@typescript-eslint/parser',

    // Parser options determine how code is parsed
    parserOptions: {
        ecmaVersion: 'latest', // Allow modern ECMAScript features
        sourceType: 'module', // Allow use of `import`/`export`
    },

    // ESLint plugins to enable additional rules
    plugins: [
        'react',
        '@typescript-eslint',

        // Prettier plugin is not recommended in modern setups.
        // If used, it allows running Prettier inside ESLint (not recommended with Prettier 3+).
        // 'prettier'
    ],

    // Custom rule configuration
    rules: {
        // If using eslint-plugin-prettier, this reports Prettier formatting errors as ESLint errors.
        // Commented out here since you're not using Prettier inside ESLint.
        // 'prettier/prettier': 'error',

        // Disable interface name prefix rule (deprecated in newer TypeScript ESLint)
        '@typescript-eslint/interface-name-prefix': 'off',

        // Warn for unused variables instead of erroring
        '@typescript-eslint/no-unused-vars': 'warn',

        // Warn on usage of `any`, but don’t block builds
        '@typescript-eslint/no-explicit-any': 'warn',
    },
};