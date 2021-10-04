module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'prettierx'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettierx/standardize',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        'prettierx/options': ['error', {
            "endOfLine": 'auto',
            "singleQuote": true,
            "trailingComma": "all",
            "arrayBracketSpacing": true,
            "semi": true,
        }],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'array-bracket-newline': ['off', { 'multiline': true, 'minItems': 4 }],
        'array-element-newline': ['error', 'consistent'],
        'array-bracket-spacing': ['error', 'always'],
        // 'indent': ['error', 2, { 'ArrayExpression': 1, 'FunctionExpression': {'parameters' : 'off'} }],
        'arrow-spacing': 'error',
        'object-curly-spacing': ['error', 'always'],
        'no-empty-pattern': 'off',
        'getter-return': 'off',
        'semi': ['error', 'always'],
        'max-len': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/ban-types': 'off'
    },
    settings: {
        prettierx: {
            usePrettierrc: true,
            editorconfig: false,
            ignorePath: ".prettierignore",
            pluginSearchDirs: [],
            plugins: [],
            withNodeModules: false,
            useCache: true
        }
    }
};