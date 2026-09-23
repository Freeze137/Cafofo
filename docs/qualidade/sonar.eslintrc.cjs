module.exports = {
  root: true,
  env: { browser: true, node: true, es2022: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['sonarjs', 'react', 'security', 'react-hooks'],
  extends: ['plugin:sonarjs/recommended', 'plugin:security/recommended'],
  settings: { react: { version: '18.3' } },
  rules: {
    'react/jsx-uses-vars': 'error',
    'react/jsx-uses-react': 'error',
    complexity: ['warn', { max: 10 }],
    'max-lines-per-function': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],
    'max-depth': ['warn', 4],
    'sonarjs/cognitive-complexity': ['warn', 15],
    'no-console': 'warn',
  },
};
