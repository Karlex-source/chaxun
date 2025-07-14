// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  server: {
    proxy: {
      // 代理1：用于在 App.tsx 中 fetch 数据并解析
      "/api/exam": {
        target: "https://yunyj.linyi.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/exam/, "/wechat/imgs"),
        secure: true,
        headers: {
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      },
      // 代理2：专门用于 iframe 显示，并移除安全头
      "/api/exam-page": {
        target: "https://yunyj.linyi.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/exam-page/, "/wechat/imgs"),
        secure: true,
        headers: {
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        // ✨ 这是魔法发生的地方！✨
        configure: (proxy, options) => {
          proxy.on("proxyRes", (proxyRes, req, res) => {
            delete proxyRes.headers["x-frame-options"];
            delete proxyRes.headers["X-Frame-Options"];
          });
        }
      }
      // '/api/proxy' 可以保留也可以移除，当前方案用不到它
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICAvLyBcdTRFRTNcdTc0MDYxXHVGRjFBXHU3NTI4XHU0RThFXHU1NzI4IEFwcC50c3ggXHU0RTJEIGZldGNoIFx1NjU3MFx1NjM2RVx1NUU3Nlx1ODlFM1x1Njc5MFxuICAgICAgJy9hcGkvZXhhbSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly95dW55ai5saW55aS5uZXQnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGlcXC9leGFtLywgJy93ZWNoYXQvaW1ncycpLFxuICAgICAgICBzZWN1cmU6IHRydWUsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQWNjZXB0JzogJ3RleHQvaHRtbCxhcHBsaWNhdGlvbi94aHRtbCt4bWwsYXBwbGljYXRpb24veG1sO3E9MC45LCovKjtxPTAuOCcsXG4gICAgICAgICAgJ1VzZXItQWdlbnQnOiAnTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2J1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXG4gICAgICAvLyBcdTRFRTNcdTc0MDYyXHVGRjFBXHU0RTEzXHU5NUU4XHU3NTI4XHU0RThFIGlmcmFtZSBcdTY2M0VcdTc5M0FcdUZGMENcdTVFNzZcdTc5RkJcdTk2NjRcdTVCODlcdTUxNjhcdTU5MzRcbiAgICAgICcvYXBpL2V4YW0tcGFnZSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly95dW55ai5saW55aS5uZXQnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGlcXC9leGFtLXBhZ2UvLCAnL3dlY2hhdC9pbWdzJyksXG4gICAgICAgIHNlY3VyZTogdHJ1ZSxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdBY2NlcHQnOiAndGV4dC9odG1sLGFwcGxpY2F0aW9uL3hodG1sK3htbCxhcHBsaWNhdGlvbi94bWw7cT0wLjksKi8qO3E9MC44JyxcbiAgICAgICAgICAnVXNlci1BZ2VudCc6ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYnLFxuICAgICAgICB9LFxuICAgICAgICAvLyBcdTI3MjggXHU4RkQ5XHU2NjJGXHU5QjU0XHU2Q0Q1XHU1M0QxXHU3NTFGXHU3Njg0XHU1NzMwXHU2NUI5XHVGRjAxXHUyNzI4XG4gICAgICAgIGNvbmZpZ3VyZTogKHByb3h5LCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVzJywgKHByb3h5UmVzLCByZXEsIHJlcykgPT4ge1xuICAgICAgICAgICAgLy8gXHU3OUZCXHU5NjY0IHgtZnJhbWUtb3B0aW9ucyBcdTU5MzRcdUZGMENcdTUxNDFcdThCQjggaWZyYW1lIFx1NUQ0Q1x1NTE2NVxuICAgICAgICAgICAgZGVsZXRlIHByb3h5UmVzLmhlYWRlcnNbJ3gtZnJhbWUtb3B0aW9ucyddO1xuICAgICAgICAgICAgZGVsZXRlIHByb3h5UmVzLmhlYWRlcnNbJ1gtRnJhbWUtT3B0aW9ucyddO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gJy9hcGkvcHJveHknIFx1NTNFRlx1NEVFNVx1NEZERFx1NzU1OVx1NEU1Rlx1NTNFRlx1NEVFNVx1NzlGQlx1OTY2NFx1RkYwQ1x1NUY1M1x1NTI0RFx1NjVCOVx1Njg0OFx1NzUyOFx1NEUwRFx1NTIzMFx1NUI4M1xuICAgIH1cbiAgfVxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsRUFDMUI7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQTtBQUFBLE1BRUwsYUFBYTtBQUFBLFFBQ1gsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGdCQUFnQixjQUFjO0FBQUEsUUFDOUQsUUFBUTtBQUFBLFFBQ1IsU0FBUztBQUFBLFVBQ1AsVUFBVTtBQUFBLFVBQ1YsY0FBYztBQUFBLFFBQ2hCO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFHQSxrQkFBa0I7QUFBQSxRQUNoQixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEscUJBQXFCLGNBQWM7QUFBQSxRQUNuRSxRQUFRO0FBQUEsUUFDUixTQUFTO0FBQUEsVUFDUCxVQUFVO0FBQUEsVUFDVixjQUFjO0FBQUEsUUFDaEI7QUFBQTtBQUFBLFFBRUEsV0FBVyxDQUFDLE9BQU8sWUFBWTtBQUM3QixnQkFBTSxHQUFHLFlBQVksQ0FBQyxVQUFVLEtBQUssUUFBUTtBQUUzQyxtQkFBTyxTQUFTLFFBQVEsaUJBQWlCO0FBQ3pDLG1CQUFPLFNBQVMsUUFBUSxpQkFBaUI7QUFBQSxVQUMzQyxDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0Y7QUFBQTtBQUFBLElBRUY7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
