import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    middleware: 'src/middleware.ts',
    react: 'src/react/index.tsx',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  external: ['react', 'react-dom', '@polaris/logger', 'express'],
  skipNodeModulesBundle: true,
});
