/// <reference types="vitest" />
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/'],
    },
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
});
