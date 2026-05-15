import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';

export default defineConfig({
  plugins: [
    react(),
    qiankun('sub-react', { useDevMode: true }),
  ],
  server: {
    port: 7101,
    cors: true,
    origin: 'http://localhost:7101',
  },
  preview: {
    port: 7101,
    cors: true,
  },
  base: 'http://localhost:7101/',
});
