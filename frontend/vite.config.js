// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: true,
  },
  resolve: {
    extensions: ['.js', '.ts']
  }
});