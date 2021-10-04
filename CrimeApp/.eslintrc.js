module.exports = {
    root: true,
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: [
        "react",
        "react-native"
    ],
    extends: [
        "eslint:recommended",
        "plugin:react-native/all",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    env: {
        "react-native/react-native": true
    },
    rules: {
        "react-native/no-unused-styles": 2,
        "react-native/split-platform-components": 2,
        "react-native/no-inline-styles": 2,
        "react-native/no-color-literals": 2,
        "react-native/no-raw-text": 2,
        "react-native/no-single-element-style-arrays": 2,
        "react/no-unescaped-entities": "off",
        "react/jsx-newline": [1, { "prevent": true }],
        "react/jsx-indent": [1, 2],
        "react/jsx-max-props-per-line": [1, { "maximum": 1 }],
        "react/jsx-indent-props": [1, 2],
        "react/jsx-first-prop-new-line": ["error", "multiline-multiprop"],
        "react/jsx-closing-bracket-location": [1, "line-aligned"],
        "jsx-quotes": ["error", "prefer-double"],
        "quotes": [2, "double"],
        "array-bracket-newline": ["error", { "multiline": true, "minItems": 4 }],
        "array-element-newline": ["error", "consistent"],
        "array-bracket-spacing": ["error", "always"],
        "@typescript-eslint/indent": ["error", 2, { "ArrayExpression": 1 }],
        "arrow-spacing": "error",
        "object-curly-spacing": ["error", "always"],
        "object-curly-newline": ["error", { "ImportDeclaration": "always" }],
        "react/prop-types": "off",
        "no-empty-pattern": "off",
        "getter-return": "off",
        "semi": ["error", "always"],
        "max-len": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/ban-types": "off",
        "react-native/no-inline-styles": "off",
        "react-native/no-color-literals": "off"
    },
};