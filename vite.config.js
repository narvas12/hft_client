// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'b050-105-113-117-67.ngrok-free.app', // 👈 Replace with your current Ngrok domain
    ],
  },
});
