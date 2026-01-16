import codeStyle from '@polaris/code-style/eslint';

export default [
  ...codeStyle,
  {
    ignores: ['**/*.d.ts'],
  },
];
