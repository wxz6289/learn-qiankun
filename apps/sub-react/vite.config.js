import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';

/** 作为 qiankun 子应用开发：useDevMode + 关闭 HMR，避免注入 @react-refresh 模块脚本 */
const useDevMode = true;

export default defineConfig({
  plugins: [
    react(),
    qiankun('sub-react', { useDevMode }),
  ],
  server: {
    port: 7101,
    cors: true,
    origin: 'http://localhost:7101',
    hmr: useDevMode ? false : true,
  },
  preview: {
    port: 7101,
    cors: true,
  },
  base: useDevMode ? 'http://localhost:7101/' : '/',
});
