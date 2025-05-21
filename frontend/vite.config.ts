import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        'react-syntax-highlighter/dist/esm/styles/prism/coy': path.resolve(__dirname, 'src/shims/prism-coy.ts'),
      },
    },
    server: {
      host: '127.0.0.1',
      port: 8080,
      strictPort: true, 
    },
});
