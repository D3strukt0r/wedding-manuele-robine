import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import browserslistToEsbuild from 'browserslist-to-esbuild';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
})
