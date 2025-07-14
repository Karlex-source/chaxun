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
      // 代理1：用于在 App.tsx 中 fetch 数据并解析
      '/api/exam': {
        target: 'https://yunyj.linyi.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/exam/, '/wechat/imgs'),
        secure: true,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      
      // 代理2：专门用于 iframe 显示，并移除安全头
      '/api/exam-page': {
        target: 'https://yunyj.linyi.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/exam-page/, '/wechat/imgs'),
        secure: true,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        // ✨ 这是魔法发生的地方！✨
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // 移除 x-frame-options 头，允许 iframe 嵌入
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['X-Frame-Options'];
          });
        }
      },
      // '/api/proxy' 可以保留也可以移除，当前方案用不到它
    }
  }
});