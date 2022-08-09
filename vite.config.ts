import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const proxyTarget = `http://${env.BACKEND_SERVER}`;

  return {
    plugins: [react(), tsconfigPaths(), splitVendorChunkPlugin()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          ws: true
        },
        '/site': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          ws: true
        }
      }
    }
  };
});
