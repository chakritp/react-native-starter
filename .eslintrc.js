module.exports = {
  root: true,
  extends: '@react-native-community',
  ignorePatterns: [
    'cosmos.userdeps.js'
  ],
  globals: {
    AbortController: 'readonly'
  },
  rules: {
    'comma-dangle': 0,
    'curly': 0,
    'eqeqeq': 0,
    'indent': [1, 2, { 'SwitchCase': 1 }],
    'key-spacing': 1,
    'no-bitwise': 0,
    'no-shadow': 0,
    'no-unexpected-multiline': 0,
    'no-unused-vars': [1, { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    'semi': [1, 'never'],
    'object-curly-spacing': [1, 'always'],
    'no-trailing-spaces': 0,
    'quotes': [0, 'single', 'avoid-escape'],

    // Typescript
    '@typescript-eslint/no-unused-vars': [1, { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],

    // Prettier Plugin
    'prettier/prettier': 0,

    // React-Hooks Plugin
    'react-hooks/rules-of-hooks': 1,
    'react-hooks/exhaustive-deps': 0,

    // React-Native Plugin
    'react-native/no-inline-styles': 0
  }
}
