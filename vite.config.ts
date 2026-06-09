import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],

  // Use the real GitHub repository name here.
  // Example final URL: https://TudorDan.github.io/space-app/
  base: '/',

  // Local development only.
  server: {
    proxy: {
      '/api': {
        target: 'https://portbigmac.runasp.net',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});