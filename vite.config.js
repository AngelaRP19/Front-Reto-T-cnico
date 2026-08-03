import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
 resolve: {
    alias: {
      fs: "empty-module",
      path: "path-browserify",
      os: "os-browserify/browser",
    },
  },
  define: {
    "process.env": {},
  },
});