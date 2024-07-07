import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import svgr from 'vite-plugin-svgr';
import {blurHash} from 'vite-plugin-blurhash';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    // Either improve this plugin, so it doesn't regenerate blurhashes on every start, or simply uncomment when needed
    // (when an image is added).
    // blurHash({
    //   imageDir: '/src/img',
    //   mapPath: '/src/img/blurhash-map.json',
    // }),
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
});
