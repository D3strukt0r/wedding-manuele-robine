import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import houdini from 'houdini/vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    houdini(),
  ],
  build: {
    target: browserslistToEsbuild(),
  },
  server: {
    host: '0.0.0.0',
    port: 80,
    strictPort: true,
    watch: {
      ignored: ['**/.pnpm-store/**'],
    },
  },
  // https://vitest.dev
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  },
  resolve: {
    alias: {
      $houdini: './$houdini',
    },
  },
});
