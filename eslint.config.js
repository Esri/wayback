import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default [
    // Base ESLint recommended rules
    js.configs.recommended,

    // TypeScript and React configuration
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tsparser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node,
                // ArcGIS JS API type namespace
                __esri: 'readonly',
                // Calcite Design System components
                HTMLCalciteButtonElement: 'readonly',
                // Environment variables injected by webpack DefinePlugin
                ENV_ARCGIS_PORTAL_ROOT_URL: 'readonly',
                ENV_WORLD_IMAGERY_BASEMAP_URL: 'readonly',
                ENV_WAYBACK_EXPORT_GP_SERVICE_ROOT_URL: 'readonly',
                ENV_METROPOLITAN_UPDATES_FEATURE_LAYER_URL: 'readonly',
                ENV_REGIONAL_UPDATES_FEATURE_LAYER_URL: 'readonly',
                ENV_COMMUNITY_UPDATES_FEATURE_LAYER_URL: 'readonly',
                ENV_SUPPORTED_LANGUAGES: 'readonly',
                ENV_WAYBACK_CONFIG_FILE_URL: 'readonly',
                ENV_WAYBACK_SUBDOMAINS: 'readonly',
                APP_ID: 'readonly',
                // React for JSX transform
                React: 'readonly',
                // Node.js types
                NodeJS: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            react: react,
        },
        rules: {
            // ESLint recommended rules are extended via js.configs.recommended

            // TypeScript ESLint recommended rules
            ...tseslint.configs.recommended.rules,

            // React recommended rules
            ...react.configs.recommended.rules,

            // Custom rule configuration
            // Disable interface name prefix rule (deprecated in newer TypeScript ESLint)
            '@typescript-eslint/interface-name-prefix': 'off',

            // Warn for unused variables instead of erroring
            '@typescript-eslint/no-unused-vars': 'warn',

            // Warn on usage of `any`, but don't block builds
            '@typescript-eslint/no-explicit-any': 'warn',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },

    // Ignore patterns
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            'webpack/**',
            '**/*.test.ts',
            '**/*.test.tsx',
        ],
    },
];
