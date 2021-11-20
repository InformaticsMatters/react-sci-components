import type { Options } from 'tsup';

export const tsup: Options = {
  dts: true,
  minify: false,
  splitting: false,
  sourcemap: "inline",
  clean: true,
  format: ['esm', 'cjs'],
  entryPoints: ['src/index.ts', 'src/FileSelector/index.ts', 'src/CenterLoader/index.tsx'],
  onSuccess: 'npm run setup',
  external: ['react', 'react-dom', '@squonk/data-manager-client']
};
