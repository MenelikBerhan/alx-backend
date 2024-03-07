
module.exports = {
  env: {
    browser: false,
    es6: true,
    mocha: true,
    // jest: true,
  },
  extends: [
    'airbnb-base',
    // 'plugin:jest/all',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  // plugins: ['jest'],
  rules: {
    'max-classes-per-file': 'off',
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'no-shadow': 'off',
    'no-restricted-syntax': [
      'error',
      'LabeledStatement',
      'WithStatement',
    ],
    'func-names': 'off',
    'prefer-arrow-callback': 'off',
    'no-unused-expressions': 'off',
    'object-curly-newline': 'off',
  },
  overrides:[
    {
      files: ['*.js'],
      excludedFiles: 'babel.config.js',
    }
  ]
};
