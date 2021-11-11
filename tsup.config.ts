import type { Options } from 'tsup';

export const tsup: Options = {
  dts: true,
  minify: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  format: ['esm', 'cjs'],
  entryPoints: ['src/index.ts', 'src/ProjectFilePicker/index.ts'],
  onSuccess: 'npm run setup',
};
