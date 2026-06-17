module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    // Permitimos co-localizar pequenos helpers/hooks junto aos componentes.
    'react-refresh/only-export-components': 'off',
    'react/prop-types': 'off',
    // Ignora variáveis de "rest" usadas apenas para omitir campos (ex.: senha).
    'no-unused-vars': ['error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
  },
}
