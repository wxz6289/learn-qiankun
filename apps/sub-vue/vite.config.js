import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import qiankun from 'vite-plugin-qiankun';

const useDevMode = true;

export default defineConfig({
  plugins: [
    vue(),
    qiankun('sub-vue', { useDevMode }),
  ],
  server: {
    port: 7102,
    cors: true,
    origin: 'http://localhost:7102',
    hmr: useDevMode ? false : true,
  },
  preview: {
    port: 7102,
    cors: true,
  },
  base: useDevMode ? 'http://localhost:7102/' : '/',
});
