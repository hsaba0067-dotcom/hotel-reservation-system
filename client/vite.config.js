import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  optimizeDeps: {
    exclude: [],
  },
  esbuild: {
    jsxInject: undefined,
  },
  server: {
    port: 5173,
    open: true,
  }
})
