module.exports = {
  extends: ['plugin:astro/recommended'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro']
      },
      rules: {}
    },
    {
      files: ['*.tsx'],
      extends: ['plugin:react-hooks/recommended', 'plugin:react/recommended'],
      plugins: ['react', 'react-hooks']
    }
  ]
}
