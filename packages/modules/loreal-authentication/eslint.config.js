import codeStyle from '@polaris/code-style/eslint';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js', '*.config.ts', 'examples/**'],
  },
  ...codeStyle,
];
