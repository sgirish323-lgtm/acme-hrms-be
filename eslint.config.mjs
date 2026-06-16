import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
    {
        ignores: [
            'build/**',
            'node_modules/**',
            'lib/migrations/**',
            'lib/seeders/**',
            'eslint.config.mjs',
            'orm-data-source.ts',
            'run-migrations.ts',
            'create-seeder.ts',
            'run-seeders.ts',
        ],
    },
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.es6,
                ...globals.node,
            },
        },
    },
    {
        files: ['**/*.js'],
        languageOptions: { sourceType: 'commonjs' },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: 'tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            prettier,
            'unused-imports': unusedImports,
        },
        rules: {
            'no-var': 'warn',
            'no-else-return': 'warn',
            'space-unary-ops': 'error',
            'new-cap': 'off',
            'no-shadow': 'off',
            camelcase: 'off',
            'func-names': 'off',
            'no-plusplus': 'off',
            'no-continue': 'off',
            'no-console': 'error',
            semi: ['error', 'always'],
            'global-require': 'off',
            'prefer-const': 'error',
            'no-multi-spaces': 'error',
            'no-await-in-loop': 'off',
            'no-unsafe-finally': 'off',
            'no-param-reassign': 'off',
            'space-in-parens': 'error',
            'consistent-return': 'off',
            'prettier/prettier': 'error',
            quotes: ['error', 'single'],
            'no-underscore-dangle': 'off',
            'no-restricted-syntax': 'off',
            'class-methods-use-this': 'off',
            'quote-props': ['warn', 'as-needed'],
            'object-shorthand': ['warn', 'always'],
            'import/no-dynamic-require': 'off',
            'no-multiple-empty-lines': 'error',
            'import/prefer-default-export': 'off',
            'import/no-extraneous-dependencies': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    args: 'after-used',
                    ignoreRestSiblings: true,
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },
];
