 import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@codelens/shared': path.resolve(__dirname, './src/shared/types.ts')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'localhost',
        changeOrigin: true
      }
    }
  }
});