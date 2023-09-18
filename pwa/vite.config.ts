import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import browserslistToEsbuild from 'browserslist-to-esbuild';

export default defineConfig({
  plugins: [
    sveltekit(),
  ],
  build: {
    target: browserslistToEsbuild(),
  },
  server: {
    host: '0.0.0.0',
    port: 80,
    strictPort: true,
  },
  // https://vitest.dev
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  },
});
