import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 7100,
    cors: true,
  },
  preview: {
    port: 7100,
  },
});
