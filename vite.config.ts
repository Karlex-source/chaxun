import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/exam': {
        target: 'https://yunyj.linyi.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/exam/, '/wechat/imgs'),
        secure: false,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      '/api/exam-page': {
        target: 'https://yunyj.linyi.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/exam-page/, '/wechat/imgs'),
        secure: false,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      '/api/proxy': {
        target: 'https://yunyj.linyi.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy/, ''),
        secure: false,
        headers: {
          'Accept': '*/*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    }
  }
});