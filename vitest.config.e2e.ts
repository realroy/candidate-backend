import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    threads: false,
    setupFiles: ['./src/tests/helpers/setup-prisma.ts'],
  },
  plugins: [swc.vite()],
});
