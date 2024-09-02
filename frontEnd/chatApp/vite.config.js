
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
        proxy: {
          '/api': {
            target: 'http://localhost:8000/api',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
      },
  build: {
    rollupOptions: {
      external: ['emoji-mart/css/emoji-mart.css'],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'emoji-mart.css') {
            return 'assets/emoji-mart.css';
          }
          return 'assets/[name].[ext]';
        },
      },
    },
  },
});
